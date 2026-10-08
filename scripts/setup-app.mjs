#!/usr/bin/env node
// Sets up the data app on a fresh Metabase, after `docker compose up -d`.
//
// Metabase gets the app only by importing it from a git repo (remote sync), and the built app
// holds ids that belong to the Metabase it was built against. So this script:
//   1. prepares Metabase: turns on model actions, makes the locked-down collection, the model
//      over `command_batch`, and its create action;
//   2. builds the app against this Metabase, in a copy under data/build (your source is untouched);
//   3. puts the result in a local git repo, data/remote-sync/repo.git, which the Metabase
//      container reads (see docker-compose.yml);
//   4. points remote sync at that repo and imports.
// It is safe to run again: if the app is already there, it stops.
//
// Needs Node 18 or later, git, and npm. It uses the URL and API key in .env.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SLUG = "app-fine-grained-access";
const APP_SRC = join(ROOT, "data_apps", SLUG);
const BUILD = join(ROOT, "data", "build");
const BUILD_APP = join(BUILD, "data_apps", SLUG);
const REPO = join(ROOT, "data", "remote-sync", "repo.git");
const REPO_URL_IN_CONTAINER = "file:///remote-sync/repo.git";
const COLLECTION_NAME = "FineGrainedAccess";
const MODEL_NAME = "Command Batch Model";
// How the warehouse connection is named inside Metabase. The real Postgres database behind it
// stays named sample_dwh (see .env's SAMPLE_DWH_DB); this is only the label Metabase shows.
const DATABASE_NAME = "dwh";
const DATABASE_NAME_OLD = "sample_dwh";
const IMPERSONATION_GROUP = "Fine Grained Access";
const IMPERSONATION_ATTRIBUTE = "db_role";
// Each demo person, logged in to Metabase, is impersonated as the matching Postgres person
// role (see seed/sample-dwh/005_demo_roles.sql and 007_demo_row_security.sql for what each
// role can read). They share one Metabase group: Postgres decides what each one sees, not a
// Metabase-side permission, so one group with a per-person attribute is all that's needed.
// The Postgres role and the Metabase login share a name on purpose, so there's nothing to
// look up between the two.
const DEMO_PEOPLE = [
  // Sales, plus a personal policy on top: the widest view of sales_orders_wide.
  { email: "bruce@example.com", dbRole: "imp_pr_rl_bruce" },
  // HR, plus a personal policy on top: the widest view of hr_employees_wide.
  { email: "thor@example.com", dbRole: "imp_pr_rl_thor" },
  // Sales and finance, no personal policy: the plain functional-role view, and
  // finance_budgets_wide shows real rows to an admin but none to Frodo (locked down,
  // no row policy).
  { email: "frodo@example.com", dbRole: "imp_pr_rl_frodo" },
];

const log = (message) => console.log(`==> ${message}`);
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

function readEnv(file) {
  if (!existsSync(file)) {
    throw new Error(`${file} not found. Copy .env.example to .env first.`);
  }
  const values = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (match) {
      values[match[1]] = match[2].replace(/^"(.*)"$/, "$1");
    }
  }
  return values;
}

const env = readEnv(join(ROOT, ".env"));
const BASE = (env.DATA_APP_MB_URL ?? "").replace(/\/$/, "");
const KEY = env.DATA_APP_MB_API_KEY;
if (!BASE || !KEY) {
  throw new Error("DATA_APP_MB_URL and DATA_APP_MB_API_KEY must be set in .env.");
}

async function api(path, { method = "GET", body, allow = [] } = {}) {
  const response = await fetch(`${BASE}/api/${path}`, {
    method,
    headers: { "x-api-key": KEY, "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok && !allow.includes(response.status)) {
    throw new Error(`${method} /api/${path} returned ${response.status}: ${text.slice(0, 300)}`);
  }
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed (exit ${result.status ?? result.error})`);
  }
}

const git = (args, cwd) =>
  run("git", ["-c", "user.name=setup-app", "-c", "user.email=setup-app@example.com", ...args], { cwd });

async function waitFor(what, check, { tries = 90, delay = 4000 } = {}) {
  for (let attempt = 0; attempt < tries; attempt++) {
    try {
      const value = await check();
      if (value) {
        return value;
      }
    } catch {
      // not ready yet
    }
    await sleep(delay);
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

// Puts each demo person in one Metabase group, gives them the db_role attribute Postgres
// needs, and turns on connection impersonation for that group on sample_dwh. The people
// themselves come from seed/metabase/config.yml, created on Metabase's own boot; this only
// wires them up. Safe to run again: every step checks what's already there first.
async function ensureDemoUsers() {
  log("Setting up demo people and connection impersonation");

  const databases = await api("database");
  const database = (databases.data ?? databases).find((db) => db.name === DATABASE_NAME);
  if (!database) {
    throw new Error(`No database named ${DATABASE_NAME}. Did Metabase finish its first start?`);
  }

  const groups = await api("permissions/group");
  let group = groups.find((g) => g.name === IMPERSONATION_GROUP);
  if (!group) {
    group = await api("permissions/group", { method: "POST", body: { name: IMPERSONATION_GROUP } });
  }

  const users = (await api("user")).data ?? [];
  for (const person of DEMO_PEOPLE) {
    const user = users.find((u) => u.email === person.email);
    if (!user) {
      log(`Skipping ${person.email}: no Metabase account with that email yet.`);
      continue;
    }
    if (user.login_attributes?.[IMPERSONATION_ATTRIBUTE] !== person.dbRole) {
      await api(`user/${user.id}`, {
        method: "PUT",
        body: { login_attributes: { ...user.login_attributes, [IMPERSONATION_ATTRIBUTE]: person.dbRole } },
      });
    }
    const members = (await api(`permissions/group/${group.id}`)).members ?? [];
    if (!members.some((m) => m.user_id === user.id)) {
      await api("permissions/membership", { method: "POST", body: { user_id: user.id, group_id: group.id } });
    }
  }

  // Every account is a member of All Users, and Metabase takes the most permissive setting
  // across all of a person's groups. So All Users has to be blocked on this database, or its
  // default access would silently outrank the impersonated group below for everyone in it.
  const allUsersGroup = groups.find((g) => g.name === "All Users");

  const graph = await api("permissions/graph");
  // The GET response leaves this out when it's empty, but the PUT needs it present, or the
  // impersonations change below is silently dropped.
  graph.sandboxes = graph.sandboxes ?? [];
  graph.groups[allUsersGroup.id] = {
    ...graph.groups[allUsersGroup.id],
    [database.id]: { "view-data": "blocked", "create-queries": "no", download: { schemas: "full" } },
  };
  graph.groups[group.id] = {
    ...graph.groups[group.id],
    [database.id]: {
      "view-data": "impersonated",
      "create-queries": "query-builder-and-native",
      download: { schemas: "full" },
    },
  };
  const alreadyMapped = (graph.impersonations ?? []).some(
    (i) => i.group_id === group.id && i.db_id === database.id,
  );
  if (!alreadyMapped) {
    graph.impersonations = [
      ...(graph.impersonations ?? []),
      { attribute: IMPERSONATION_ATTRIBUTE, db_id: database.id, group_id: group.id },
    ];
  }
  await api("permissions/graph", { method: "PUT", body: graph });
}

const DEMO_COLLECTION = "RLS Demo";
const DEMO_DASHBOARD = "RLS Demo";
// Plain native SQL: each one runs through whatever role Metabase has impersonated the viewer
// as, the same as any other question would. The first card answers "who am I in the database,
// and what do I belong to", from Postgres's own system catalogs (current_user, pg_auth_members,
// pg_roles), readable by any role, no grant needed. The next two are a simple count per
// protected table, to show a table-level access change (a grant or revoke). The last is a world
// map by country, on the same column the sales row policy itself filters on (country_name), to
// show a row-level change instead: edit which countries a policy allows, refresh, and the map
// changes, even though the role's table access never did.
const DEMO_CARDS = [
  {
    name: "Who you are in the database",
    sql: [
      "select current_user as dwh_user,",
      "  (select string_agg(r.rolname, ', ' order by r.rolname)",
      "   from pg_auth_members m join pg_roles r on r.oid = m.roleid",
      "   where m.member = (select oid from pg_roles where rolname = current_user)",
      "     and r.rolname ~ '^imp_fn_rl_') as dwh_roles",
    ].join("\n"),
    display: "table",
    layout: { row: 0, col: 0, size_x: 24, size_y: 4 },
  },
  {
    name: "staging.sales_orders_wide: rows you can see",
    sql: "select count(*) as orders from staging.sales_orders_wide",
    display: "scalar",
    layout: { row: 4, col: 0, size_x: 12, size_y: 4 },
  },
  {
    name: "staging.hr_employees_wide: rows you can see",
    sql: "select count(*) as employees from staging.hr_employees_wide",
    display: "scalar",
    layout: { row: 4, col: 12, size_x: 12, size_y: 4 },
  },
  {
    name: "staging.sales_orders_wide: countries you can see",
    sql: "select country_name, count(*) as orders from staging.sales_orders_wide group by country_name order by country_name",
    display: "map",
    visualization_settings: {
      "map.type": "region",
      "map.region": "world_countries",
      "map.dimension": "country_name",
      "map.metric": "orders",
    },
    layout: { row: 8, col: 0, size_x: 24, size_y: 7 },
  },
];

// A small dashboard with one card per protected table, for Bruce, Thor, and Frodo to open
// after logging in: the row count on screen is whatever their own row policies allow. A new
// collection defaults to viewable by everyone, which is what a demo needs here, so this
// doesn't touch collection permissions the way the locked-down FineGrainedAccess one does.
async function ensureDemoDashboard() {
  log("Setting up the RLS demo dashboard");

  const databases = await api("database");
  const database = (databases.data ?? databases).find((db) => db.name === DATABASE_NAME);

  const collections = await api("collection");
  let collection = collections.find((c) => c.name === DEMO_COLLECTION && !c.archived);
  if (!collection) {
    collection = await api("collection", { method: "POST", body: { name: DEMO_COLLECTION } });
  }

  const items = (await api(`collection/${collection.id}/items?models=card`)).data ?? [];
  const cards = [];
  for (const demoCard of DEMO_CARDS) {
    let card = items.find((item) => item.model === "card" && item.name === demoCard.name);
    if (!card) {
      card = await api("card", {
        method: "POST",
        body: {
          name: demoCard.name,
          type: "question",
          display: demoCard.display,
          collection_id: collection.id,
          visualization_settings: demoCard.visualization_settings ?? {},
          dataset_query: {
            database: database.id,
            type: "native",
            native: { query: demoCard.sql },
          },
        },
      });
    }
    cards.push({ id: card.id, layout: demoCard.layout });
  }

  const dashboards = await api("dashboard");
  let dashboard = (dashboards.data ?? dashboards).find(
    (d) => d.name === DEMO_DASHBOARD && !d.archived,
  );
  if (!dashboard) {
    dashboard = await api("dashboard", {
      method: "POST",
      body: { name: DEMO_DASHBOARD, collection_id: collection.id },
    });
  }
  const full = await api(`dashboard/${dashboard.id}`);
  let dashcards = full.dashcards ?? [];
  let changed = false;
  cards.forEach(({ id: cardId, layout }, index) => {
    const existing = dashcards.find((dc) => dc.card_id === cardId);
    if (existing) {
      // Keep the position in sync with DEMO_CARDS, so adding or reordering a card here
      // doesn't leave an old one sitting at a now-stale position underneath it.
      const outOfDate = Object.entries(layout).some(([key, value]) => existing[key] !== value);
      if (outOfDate) {
        Object.assign(existing, layout);
        changed = true;
      }
      return;
    }
    dashcards.push({
      id: -1 - index,
      card_id: cardId,
      ...layout,
      parameter_mappings: [],
      visualization_settings: {},
    });
    changed = true;
  });
  if (changed) {
    await api(`dashboard/${dashboard.id}`, { method: "PUT", body: { dashcards } });
  }
}

// seed/metabase/config.yml names the connection DATABASE_NAME directly, so this only matters
// on a stack whose app-db volume predates that name (an older "sample_dwh" connection). Finds
// it by its old name and renames it in place, rather than creating a second connection.
async function ensureDatabaseRenamed() {
  const databases = (await api("database")).data ?? [];
  if (databases.some((db) => db.name === DATABASE_NAME)) {
    return;
  }
  const old = databases.find((db) => db.name === DATABASE_NAME_OLD);
  if (!old) {
    return;
  }
  log(`Renaming the "${DATABASE_NAME_OLD}" connection to "${DATABASE_NAME}"`);
  await api(`database/${old.id}`, { method: "PUT", body: { name: DATABASE_NAME } });
}

// Metabase ships a built-in "Sample Database" (SQLite) on every install. It's unrelated to
// this app's own warehouse and just clutters the sidebar, so remove it once Metabase is up.
async function ensureNoSampleDatabase() {
  const databases = (await api("database")).data ?? [];
  for (const db of databases.filter((d) => d.is_sample)) {
    log(`Removing the built-in "${db.name}"`);
    await api(`database/${db.id}`, { method: "DELETE" });
  }
}

async function main() {
  log(`Waiting for Metabase at ${BASE}`);
  await waitFor("Metabase to start", async () => (await api("health")).status === "ok");

  await ensureDatabaseRenamed();
  await ensureNoSampleDatabase();

  const existing = await api(`apps/${SLUG}`, { allow: [404] });
  if (existing?.enabled && !existing.sync_error) {
    log(`The app is already set up: ${BASE}/apps/${SLUG}`);
    await ensureDemoUsers();
    await ensureDemoDashboard();
    return;
  }

  const repoStatus = await api("apps/repo-status");
  if (repoStatus?.configured && repoStatus.url !== REPO_URL_IN_CONTAINER) {
    throw new Error(
      `Remote sync already points at ${repoStatus.url}. This script won't change that. ` +
        "Pull the app with your own remote sync instead.",
    );
  }

  // 1. Prepare Metabase
  log(`Preparing the ${DATABASE_NAME} connection`);
  const databases = await api("database");
  const database = (databases.data ?? databases).find((db) => db.name === DATABASE_NAME);
  if (!database) {
    throw new Error(`No database named ${DATABASE_NAME}. Did Metabase finish its first start?`);
  }
  if (!database.settings?.["database-enable-actions"]) {
    await api(`database/${database.id}`, { method: "PUT", body: { settings: { "database-enable-actions": true } } });
  }
  const findTable = async (name) => {
    const metadata = await api(`database/${database.id}/metadata?include_hidden=false`);
    return metadata.tables.find((t) => t.schema === "fine_grained_access" && t.name === name);
  };
  if (!(await findTable("command_batch"))) {
    await api(`database/${database.id}/sync_schema`, { method: "POST" });
  }
  const commandBatch = await waitFor("the warehouse tables to sync", () => findTable("command_batch"), {
    tries: 60,
    delay: 3000,
  });

  log(`Creating the ${COLLECTION_NAME} collection and locking it down`);
  const collections = await api("collection");
  let collection = collections.find((c) => c.name === COLLECTION_NAME && !c.archived);
  if (!collection) {
    collection = await api("collection", { method: "POST", body: { name: COLLECTION_NAME } });
  }
  // The actions in it create roles and grants, so only administrators may use it. New
  // collections start with write access for All Users.
  const graph = await api("collection/graph");
  const adminGroup = (await api("permissions/group")).find((g) => g.name === "Administrators");
  for (const groupId of Object.keys(graph.groups)) {
    if (Number(groupId) !== adminGroup.id) {
      graph.groups[groupId][collection.id] = "none";
    }
  }
  await api("collection/graph", { method: "PUT", body: graph });

  log(`Creating the ${MODEL_NAME} and its create action`);
  const items = await api(`collection/${collection.id}/items?models=dataset`);
  let model = items.data.find((item) => item.name === MODEL_NAME);
  if (!model) {
    model = await api("card", {
      method: "POST",
      body: {
        name: MODEL_NAME,
        type: "model",
        display: "table",
        visualization_settings: {},
        collection_id: collection.id,
        dataset_query: { database: database.id, type: "query", query: { "source-table": commandBatch.id } },
      },
    });
  }
  const actions = await api(`action?model-id=${model.id}`);
  if (!actions.some((a) => a.kind === "row/create")) {
    await api("action", {
      method: "POST",
      body: { name: "Create", type: "implicit", kind: "row/create", model_id: model.id },
    });
  }

  // 2. Build the app against this Metabase, in a copy
  log("Building the app against this Metabase (this installs packages the first time)");
  mkdirSync(join(BUILD, "data_apps"), { recursive: true });
  const keepModules = existsSync(join(BUILD_APP, "node_modules"));
  for (const entry of ["actions", "queries", "src", "scripts", "dist"]) {
    rmSync(join(BUILD_APP, entry), { recursive: true, force: true });
  }
  cpSync(APP_SRC, BUILD_APP, {
    recursive: true,
    filter: (source) => !source.split(/[\\/]/).includes("node_modules"),
  });
  // The build tools read the URL and key from ../../.env, which is data/build/.env here.
  writeFileSync(join(BUILD, ".env"), `DATA_APP_MB_URL=${BASE}\nDATA_APP_MB_API_KEY=${KEY}\n`);
  writeFileSync(join(BUILD, ".gitignore"), ".env\nnode_modules/\n");

  const schemaResponse = await fetch(
    `${BASE}/api/typed-schemas/v1/typescript?database=${DATABASE_NAME}&include-models=true`,
    { headers: { "x-api-key": KEY, accept: "text/typescript" } },
  );
  if (!schemaResponse.ok) {
    throw new Error(`Could not generate the typed schema: ${schemaResponse.status}`);
  }
  writeFileSync(join(BUILD_APP, "src", "metabase.data.ts"), await schemaResponse.text());

  if (!keepModules) {
    run("npm", ["ci"], { cwd: BUILD_APP });
  }
  run("npm", ["run", "build"], { cwd: BUILD_APP });

  // 3. Put the result in a local git repo that the Metabase container can read
  log("Saving the built app to the local repo");
  if (!existsSync(join(BUILD, ".git"))) {
    git(["init", "-q", "-b", "main"], BUILD);
  }
  git(["add", "-A"], BUILD);
  git(["commit", "-q", "--allow-empty", "-m", "built-data-app"], BUILD);
  if (!existsSync(REPO)) {
    mkdirSync(dirname(REPO), { recursive: true });
    git(["init", "-q", "--bare", "-b", "main", REPO], ROOT);
  }
  git(["push", "-q", "-f", REPO, "main"], BUILD);

  // 4. Remote sync
  log("Importing the app into Metabase");
  if (!repoStatus?.configured) {
    await api("ee/remote-sync/settings", {
      method: "PUT",
      body: {
        "remote-sync-url": REPO_URL_IN_CONTAINER,
        "remote-sync-type": "read-only",
        "remote-sync-branch": "main",
      },
    });
  } else {
    await api("ee/remote-sync/import", { method: "POST", body: { branch: "main", force: true } });
  }
  const app = await waitFor("the app to be imported", async () => {
    const found = await api(`apps/${SLUG}`, { allow: [404] });
    return found?.enabled && !found.sync_error ? found : null;
  }, { tries: 40, delay: 3000 });
  if (!app) {
    throw new Error("The app was not imported.");
  }

  await ensureDemoUsers();
  await ensureDemoDashboard();
  log(`Done. Open ${BASE}/apps/${SLUG} (sign in as an administrator).`);
}

main().catch((error) => {
  console.error(`\nSetup failed: ${error.message}`);
  process.exit(1);
});
