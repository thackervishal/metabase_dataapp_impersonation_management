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
const DATABASE_NAME = "sample_dwh";

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

async function main() {
  log(`Waiting for Metabase at ${BASE}`);
  await waitFor("Metabase to start", async () => (await api("health")).status === "ok");

  const existing = await api(`apps/${SLUG}`, { allow: [404] });
  if (existing?.enabled && !existing.sync_error) {
    log(`The app is already set up: ${BASE}/apps/${SLUG}`);
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
  log(`Done. Open ${BASE}/apps/${SLUG} (sign in as an administrator).`);
}

main().catch((error) => {
  console.error(`\nSetup failed: ${error.message}`);
  process.exit(1);
});
