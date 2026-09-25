# Build Plan: Postgres RBAC Viewer/Editor as a Metabase Data App

Written for a developer who knows Metabase but is new to front-end code (React/TypeScript), git-based
"remote sync", and Metabase data apps. Concepts are explained where they first matter; jump to the
[primer](#concept-primer-read-this-first) if any term is unfamiliar.

## 1. Goal and scope

Build a small web app that runs **inside Metabase** (a "data app") and lets an admin manage the
**database side** of access control in the `sample_dwh` Postgres database.

- **v1 (read-only):** show every Postgres role, the privileges each role has on every table
  (schema → table tree), and which roles are members of which.
- **v1.1 (per-person summary):** for a person, show what they can actually do, split into what they hold
  directly and what each functional role gives them (see B6.1).
- **v2 (editing):** create/drop roles, create/drop login users, grant/revoke table privileges, add/remove
  role memberships.

**Explicitly out of scope:** mapping *Metabase* users to Postgres roles (via impersonation attributes).
That link lives in Metabase's own application database, and a data app cannot read it (see
[Why this is scoped to the DB side](#why-this-is-scoped-to-the-db-side)). "People" in this app means
**Postgres login roles** (`rolcanlogin = true`), not Metabase accounts.

## 2. How the pieces fit together

```
                    git repo  (this repo, on GitHub)
                    data_apps/app-fine-grained-access/  <- React app source + built dist/index.js
                          |
                          |  "Pull changes" (remote sync)
                          v
   Browser  <----  Metabase (EE, data-apps feature)  ----JDBC---->  sample_dwh (Postgres)
   /apps/app-fine-grained-access      |   runs your JS bundle in a sandbox           |
                         |                                              |- fine_grained_access.v_* views    (READ)
   your React code calls |                                              |- fine_grained_access.command_*   (WRITE)
   Metabase hooks:       |                                                  tables + triggers run the
    useMetabaseQuery -> reads a synced table/view                           real CREATE/GRANT/... DDL
    useAction        -> runs an "action" that INSERTs a command row
```

Two rules of the platform shape the whole design:

1. **The app can only read *tables* (and views) that Metabase has synced.** Queries are built from a
   generated TypeScript schema, not raw SQL. So everything we want to display must exist as a view in
   Postgres. That's what `fine_grained_access.v_*` are for.
2. **The app can only write through Metabase *actions*.** Actions bind *values* into SQL; they can't
   build `GRANT ... ON <table> TO <role>` because table/role names are identifiers, not values. So each
   write = an `INSERT` into a "command table", and a Postgres trigger turns that row into the real DDL.
   The trigger is `SECURITY DEFINER`, so Metabase's own DB user never needs `CREATEROLE`.

## 3. Why this is scoped to the DB side

- The Metabase-user → Postgres-role link is stored in Metabase's app DB (user login attributes + the
  group's connection-impersonation setting).
- A data app can't call Metabase's REST API (the sandbox blocks raw `fetch` to the Metabase origin) and
  can't query the app DB.
- You confirmed you can't read the app DB either, so we drop it. If this ever changes, the cleanest
  route is a second Metabase database connection pointing at the app DB (read-only) plus synced tables.

## 4. Current state of this repo

The `init` commit already contains a first draft of Part A (nothing has been run or verified yet):

| File | What it does | Status |
|---|---|---|
| `docker-compose.yml` | `app-db` (Metabase's DB), `sample-dwh` (Postgres 16), `metabase` (image `metabase/metabase-enterprise:v1.64.x`, floating) | untested |
| `seed/sample-dwh/001_seed.sql` | The demo warehouse: 104 tables in `public`, `staging`, and `analytics` (see DATA_APPS_101.md) | loaded, verified |
| `seed/sample-dwh/002_fine_grained_access_reads.sql` | views `v_schema_tree`, `v_roles` (`role_kind` person/functional, read from the role comment), `v_grants`, `v_memberships` (`member_name`, `role_name`); hides superusers, `pg_*` and `metabase_reader` | fixed and verified (A2 done) |
| `seed/sample-dwh/005_demo_roles.sql` | demo functional roles `sales`/`finance`/`hr` and people alice..frank (bob and erin have two roles), all NOLOGIN, kind stored as a role comment; some grants | loaded, verified |
| `seed/sample-dwh/006_demo_impersonation.sql` | `grant <person> to metabase_reader with inherit false, set true` so Metabase can `SET ROLE` to each person | loaded, verified |
| `seed/sample-dwh/003_fine_grained_access_writes.sql` | 4 command tables + `SECURITY DEFINER` triggers | untested, hardening needed (see A3) |
| `seed/sample-dwh/004_create_metabase_role.sh` | creates `metabase_reader` (SELECT on views, INSERT on command tables) | untested |
| `seed/metabase/config.yml` | admin user, API key, `sample_dwh` connection as `metabase_reader` | untested |

## 5. Step 0: license and version (resolved)

**Result (2026-09-23):** on a separate multi-version test stack, Metabase `1.64.0.1-beta` showed the Data
apps admin page, so the token and the published beta image both work. **This repo uses that same image in its
own single-purpose stack (`docker-compose.yml`); no build from `../metabase` is needed.** Background:

Data apps are gated by the premium feature `:data-apps-preview`.

1. **Token:** start the stack (Part A), log in as admin, and check that the Data apps section appears in
   Admin. If it doesn't, the `MB_PREMIUM_EMBEDDING_TOKEN` in `.env` lacks the entitlement and nothing in
   Part B can proceed until you get one. The compose file sets `MB_STORE_USE_STAGING=true`, so the token
   must be valid against the *staging* token store.
2. **Image:** (earlier the compose file built Metabase from a local `../metabase` checkout; now replaced by the published image.) The old note:
   Checked 2026-09-21: `static.metabase.com/version-info-ee.json` lists
   **v1.63.18 as the latest stable**; 1.64 is still beta. Docker Hub (`metabase/metabase-enterprise`) does
   have `v1.64.0-beta`, `v1.64.0.1-beta`, and the floating `v1.64.0.x` / `v1.64.x`. The data-apps commit
   (2026-07-18) is an ancestor of the local `v0.64.0.1-beta` tag, so **`v1.64.0.1-beta` (or `v1.64.x`)
   should contain data apps**. Try that image first (`image:` instead of `build:`, a two-line change);
   only build from source if the feature is missing or you need newer master fixes. 1.63.x images
   predate the feature.
3. **Beta warning:** the app SDK is pinned to the npm tag `64-alpha` and the bundled skills say "not yet
   released". Expect APIs to shift; re-read `metabase/skills/metabase-data-app-*` if something breaks.

## Part A: Database and Metabase stack (Claude builds and verifies)

Goal: `docker compose up` gives you Metabase plus a seeded warehouse where you can prove the SQL side works
using only `psql`, before any front-end code exists.

### A1. Bring the stack up
```bash
cp .env.example .env        # fill in passwords + your Metabase token
docker compose up -d        # pulls metabase/metabase-enterprise:${MB_IMAGE_TAG} (default v1.64.x)
docker compose ps           # all three services healthy
```
Note: scripts in `seed/sample-dwh/` run **only on the first boot of an empty volume**. After editing
them, reset with `docker compose down -v` (this deletes all data in the compose volumes).

### A2. Fix `v_grants` (known bug to verify, then fix)
The draft uses `information_schema.role_table_grants`. That view only lists grants where the *current
user* is the grantor/grantee (or holds that role), so when Metabase connects as `metabase_reader` it will
likely see almost nothing. Verify with:
```bash
psql -h localhost -p 5433 -U metabase_reader sample_dwh -c "select count(*) from fine_grained_access.v_grants"
```
If the count is wrong/near zero, rewrite the view on the raw catalog, which is readable by everyone:
```sql
create or replace view fine_grained_access.v_grants as
select
  n.nspname                                       as schema_name,
  c.relname                                       as table_name,
  case when a.grantee = 0 then 'PUBLIC'
       else pg_get_userbyid(a.grantee) end        as role_name,
  a.privilege_type                                as privilege
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
where c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by 1, 2, 3, 4;
```
(`aclexplode` expands the table's raw access-control list into one row per grant; `acldefault` covers
tables whose owner never explicitly granted anything.)

### A3. Harden the command triggers (before v2)
- **Protect reserved roles inside the trigger, not just the UI.** Anyone holding `INSERT` on a command
  table bypasses the UI, so the trigger is the real security boundary. Reject any command that targets
  `postgres`, `metabase_reader`, superusers, or `pg_*` roles.
- **Every role starts with `imp_fn_rl_` (functional) or `imp_pr_rl_` (person)**: imp = impersonation, fn =
  functional, pr = person, rl = role. The prefix also says the kind, so no role comment is stored. The views
  show only roles with a prefix, and the command triggers call `require_managed_role()` first, so the app
  can't create, drop, grant to, or add members to any other role. Names are capped at 63 characters, the
  Postgres limit, because Postgres silently cuts longer ones. Done and verified, including the limit.
- **People never log in.** Metabase impersonates a person by running `SET ROLE <person>` (Postgres driver),
  so every role is `NOLOGIN` and person roles need no password at all. That simplifies `command_user`:
  "create person" = `create role <name> nologin` + `comment on role <name> is 'person'`, and it must also
  `grant <name> to <connection_role> with inherit false, set true`, or the impersonating connection user
  can't switch to that person. "Create functional role" = same with the comment `'functional'`. The
  `role_kind` shown by `v_roles` comes from that comment (an unmarked role shows as `unclassified`).
  Consider dropping `command_user.password` entirely.
- **Don't keep passwords.** `command_user.password` currently stores the plaintext password forever.
  Add `new.password := null;` at the end of `apply_user_command()` before `return new`.
- **`drop role` fails if the role still owns objects or holds privileges.** Decide the behaviour: either
  surface Postgres's error to the user (simplest, and the app shows `error.data.message` verbatim) or run
  `drop owned by` first.
- Every command row has `requested_at`, so the tables double as an audit log. There is no `requested_by`
  because every action runs as `metabase_reader`; who clicked is only in Metabase's own action audit.

### A4. Verification checklist (must all pass before Part B)
- [ ] Sample data exists in `analytics` and `sales`.
- [ ] As `metabase_reader`: all four views return rows, and `v_grants` shows real grants.
- [ ] As `metabase_reader`: `insert into fine_grained_access.command_role (role_name, action) values ('demo','create')`
      creates a role, and `... 'drop'` removes it.
- [ ] Same for `command_grant` (grant then revoke `SELECT`), `command_user`, `command_membership`.
- [ ] `metabase_reader` **cannot** run `create role` or `grant` directly (proves the triggers are the only path).
- [ ] Metabase is reachable at `http://localhost:3000`, the `sample_dwh` connection is green, and the four
      views + four command tables show up as tables after a sync.

## Concept primer (read this first)

| Term | Plain-English meaning |
|---|---|
| **React** | A JS library where UI is built from *components*: functions that return markup (JSX/TSX) describing what to show. |
| **TSX / TypeScript** | TypeScript is JS with types; `.tsx` files mix it with JSX markup. `npm run typecheck` runs the type checker (the dev server does not). |
| **Props** | Arguments passed into a component: `<RolePicker roles={roles} />`. |
| **State (`useState`)** | A value a component remembers between renders (e.g. which role is selected). Changing it re-renders the component. |
| **Hook** | A function starting with `use...` that plugs into React (or Metabase) features. Rule: call hooks at the top level of a component, never in loops/ifs. |
| **Vite** | The dev server + bundler. `npm run dev` previews the app; `npm run build` produces one `dist/index.js` file. |
| **Bundle** | That single JS file. Metabase loads it, not your source. It must be committed to git. |
| **Sandbox** | Metabase runs the bundle in an isolated JS realm. `fetch`, `localStorage`, `alert`, `window.open` etc. are blocked. State that must persist goes through actions. |
| **Remote sync** | A Metabase (EE) feature that connects Metabase to a git repo. Data apps are *delivered through git*: you commit, push, then click "Pull changes" in Metabase. There is no upload button. |
| **Model** | A Metabase saved question treated as a table. A model over a table can have *actions*. |
| **Action** | A saved write operation on a model. "Implicit" ones are auto-generated create/update/delete on that model's table. |
| **`defineQuery` / `defineAction`** | Functions you call in `queries/` and `actions/` (root-level folders, beside `package.json`) to *declare* every query/action the app uses. The build syncs them into Metabase. Inline queries/actions don't compile. |
| **Generated schema (`metabase.data.ts`)** | A TypeScript file downloaded from your Metabase describing its tables, fields, models and actions, so your code gets autocomplete and type errors. Instance-specific. |
| **`sync-resources`** | Build step that copies each declared query/action into the app's own Metabase collection and writes the resulting IDs back into your source + `resources_metadata.json`. Commit those changes. |

## Part B: The data app (a guided walkthrough, built together)

This part is done *with you*, one step at a time, explaining each step. Nothing here is built unattended.

### B1. Where the app lives (decided)
Data apps live in `data_apps/<slug>/` of **the git repo connected to Metabase**. We use **this repo**
(`metabase_dataapp_impersonation_management`, on GitHub, cloned locally): you build and commit in your
clone, push, and Metabase pulls from GitHub. The flow is `your clone → GitHub → Metabase (caches the
bundle in its app DB) → the browser downloads the bundle from Metabase and runs it in a sandbox`. Browsers
never talk to git.

Fix `.gitignore` first: it ignores `dist/`, but the built bundle **must be committed**. Change `dist/` to
`/dist/` (root only) or add `!data_apps/**/dist/`.

### B2. Connect the repo to Metabase (remote sync)
This repo's own stack (Metabase on `http://localhost:3000`). It has no built-in git repo, so the remote sync
settings stay editable in the Admin UI.
1. **Nothing to turn off.** (The separate multi-version repo passes a local repo URL as env vars, which locks
   those fields; this stack doesn't.)
2. **Create a GitHub fine-grained personal access token** limited to this repo: Contents read-only if
   Metabase only pulls (preferred), read/write only if you let Metabase push. Never commit it.
3. **Admin → Settings → Remote sync:** URL `https://github.com/<you>/metabase_dataapp_impersonation_management.git`,
   the token, branch `main`. Prefer the pull-only (read-only) type so Metabase never writes to your repo.
   Metabase (in Docker) needs internet access to github.com.
4. **How you pull later:** read-only mode → the Remote sync tab; read/write mode → "Pull changes" in the
   branch dropdown at the top left of Metabase.
5. Confirm the Data apps admin page shows the repo URL.
Untested: whether an import works on a repo that has no Metabase collection YAML yet. If Pull changes
complains, note the exact message.

### B3. Prepare Metabase to serve the app's data
1. Admin → Databases → `sample_dwh` → confirm it's synced; the four `v_*` views and four `command_*`
   tables should be listed. **Enable "Model actions"** for this database (required for actions).
2. Create one **model** per command table (e.g. "Role commands" over `fine_grained_access.command_role`), then
   generate its basic actions (create). These are what the app will call.
3. Create an **API key** (Admin → Authentication → API keys, admin group). Put it in `.env.local` at the
   **repo root**: `DATA_APP_MB_URL=http://localhost:3000` and `DATA_APP_MB_API_KEY=...`.
   (The key can start blank; an agent may create `.env.local` for you and you fill the key in later.)
   (`.env.local` is already git-ignored. Never paste the key into chat or commit it.) The existing
   `MB_AUTOMATION_API_KEY` from `.env` works if it's an admin key.
4. Add `http://localhost:5174` under Admin → Embedding → Embedded analytics SDK → CORS origins, or the
   dev preview will fail.

### B4. Scaffold the app
Requirements: Node + npm. Copy the template that ships in the Metabase repo:
`metabase/skills/metabase-data-app-setup/template/` → `data_apps/app-fine-grained-access/` (slug must be
lowercase-dashed; it becomes the URL `/apps/app-fine-grained-access`). Then inside it:
1. Edit `package.json` `name`, and `data_app.yaml` (`name`, one-line `description`, leave `path`).
2. `npm install @metabase/embedding-sdk-react@64-alpha`, then `npm install`.

   **Optional, agent-assisted build:** Metabase intends data apps to be built by an AI agent. Admin → Data
   apps shows the install command for the agent instruction files ("skills"). Use the tag that matches the
   instance: `npx skills add metabase/metabase/skills#release-x.64.x --skill metabase-data-app-setup
   --skill metabase-data-app-routing --skill metabase-data-app-actions --skill metabase-data-app-semantic-layer`
   (not `#master`, which can drift from a 1.64 beta). Then open Claude Code in this repo and describe the
   app. A good way to learn is to let the agent draft a step and then read what it wrote.
3. Remove the lockfile-ignoring lines from the app's own `.gitignore` (the lockfile should be committed).
4. `npm run dev` → open `http://localhost:5174` → you should see "Hello, data app".
5. `npm run typecheck` passes on the untouched template.

Project layout you'll end up with (don't edit `src/index.tsx` or `vite.config.ts`):
```
data_apps/app-fine-grained-access/
  data_app.yaml          name, description, bundle path
  queries/               defineQuery exports (reads)      <- NOT under src/
  actions/               defineAction exports (writes)    <- NOT under src/
  src/index.tsx          template entry, leave alone
  src/App.tsx            page layout + state
  src/metabase.data.ts   GENERATED schema, don't hand-edit
  src/components/        RolePicker, PermissionGrid, ...
```

### B5. Generate the typed schema
Download the schema for just this database, including models (so actions are included):
```
GET $DATA_APP_MB_URL/api/typed-schemas/v1/typescript?database=sample_dwh&include-models=true
header: x-api-key: $DATA_APP_MB_API_KEY   header: Accept: text/typescript
```
Save it as `src/metabase.data.ts`. Open it and find `schema.tables.<view>` and
`schema.models.<model>.actions.create`. Re-run this whenever tables/models change in Metabase.

You do **not** need Library collections, metrics, measures or segments (the "semantic layer" in Metabase's
docs); the `database=` scope reads plain tables. Fallback if the views are missing from the schema:
publish them into the Data library in Data Studio and use `include-data-library=true`.

### B5.1. Target screen (end state, 2026-09-24)

The app manages `SELECT` on tables and nothing else. No role created here gets any other privilege.

```
 Tree                      analytics.events

 ▾ analytics               Functional roles
     daily_metrics           [x] hr
     events   <selected>     [ ] finance
 ▾ sales                     [ ] sales
     customers             People
     order_items             [ ] dave     through hr     <- grey check, not clickable
     orders                  [x] erin
                             [ ] alice
```

**How it reads.** The left side is a tree of schemas and tables. Selecting a node opens the right panel:
the functional roles first, then the people, each with a checkbox that answers "can this role read this node?".

**Four checkbox states, so a person's real access is visible at a glance:**

| State | Meaning | Editable in v2 |
| --- | --- | --- |
| Solid blue check | Granted to this role itself | Yes: click to revoke |
| Grey ring with a check | Inherited from a functional role the person belongs to (hover shows which) | No: change the functional role instead |
| Half-filled ring (schemas and the database) | The role can read some of the tables underneath | Yes |
| Empty ring | No access | Yes: click to grant |

**The schema node.** Its checkbox summarizes its tables: filled if the role can read all of them, partly
filled if some, empty if none. In v2, checking it runs `USAGE` on the schema and `SELECT` on each table that
exists at that moment. The tables underneath then show the result.

**Data it needs.** `v_schema_tree` (tree), `v_roles` (both role lists), `v_grants` (direct `SELECT` grants),
and `v_memberships` (who is in what). The app follows memberships through other roles on the client, in
`src/lib/access.ts`. At this size it loads everything once. On a large warehouse, load per selected node.

**Build order.** v1 draws the whole screen read-only, including the grey states. v2 turns on the clicks for
the filled, partly filled, and empty states and leaves the grey ones locked.

**Decided:** SELECT only, so no privilege picker; a grey check with "through <role>" (not an asterisk) for
inherited access; checking a schema grants `USAGE` plus `SELECT` on its current tables.

**TODO (later, separate project):**
- Tables created after a schema was granted are not covered. Options include default privileges, or a
  scheduled re-grant.
- Show schema-level `USAGE` on the screen. Today a role can look like it reads a table it can't reach
  because it lacks `USAGE` on the schema.
- Grants to `PUBLIC` (everyone) are ignored by the screen.
- Verify the inheritance rules in `src/lib/access.ts` for the PG16 per-membership `inherit` option. The
  screen assumes the default (inherit on).

### B6. v1 build (read-only): done

Built as one screen rather than the step-by-step pieces first drafted here. `DATA_APPS_101.md` explains each
piece. What exists:

1. **Four queries** in `queries/`: roles, grants (`SELECT` only), memberships, and the schema tree. Each is
   called once, in `App.tsx`, and the results are passed down as props.
2. **`src/lib/access.ts`:** the rules for direct and inherited access, checked against Postgres's
   `has_table_privilege()` for every demo person.
3. **Two tabs.** Permissions has a switch between "By object" (tree, then roles) and "By role" (roles, then tree). Role Mapping has "By role" and "By person". Components: `SchemaTree`, `AccessPanel`, `RoleList`, `PermissionsTab`, `RoleMappingTab`, `AccessMark`, and `Tabs`. State lives in each tab, and both tabs stay mounted.

Still to check: how many rows a query returns by default. The demo is tiny, but grants can be numerous, so
add a `limit` or a filter if a result is truncated. Verify this rather than assuming.

Preview it from `data_apps/app-fine-grained-access/` with `npm run dev`.

### B6.1. v1.1: per-person summary (mostly delivered)

The "What a role can access" view already shows, for a selected person, the whole tree with grey rings for
access that comes through functional roles, and the Role Mapping tab shows which roles a person is in. What's
left is optional: a plain two-part list for a selected person, "held directly" and "from each functional
role", if the tree view isn't enough.

### B7. Ship v1
1. `npm run build` (runs `sync-resources`, then bundles to `dist/index.js`). Commit the source,
   `data_app.yaml`, `dist/index.js`, lockfile, and `resources_metadata.json`.
2. `git push`, then pull in Metabase (see B2.4).
3. Open `http://localhost:3000/apps/app-fine-grained-access` as admin. Admins can see every app; other users need to
   be in the app's auto-created permission group **and** need normal access to the `fine_grained_access`
   tables (the app group grants no data access by itself).
4. **Also test as a non-admin.** The dev preview (`npm run dev`) runs as the API key's user, so with an
   admin key it hides permission problems a real viewer would hit.

### B8. v2 build (editing), one write at a time (grant, revoke, and memberships are done)
Add the writes in this order (each is one model action + one small form/button):

1. **Grant/revoke privilege** (`command_grant`): make each cell in the permission grid a checkbox.
   On click: `execute({ schema_name, table_name, role_name, privilege, should_grant: !current })`,
   then **refetch grants**. The action cannot update the screen for you; after `await execute(...)` you
   must call the query's refetch, or the checkbox shows stale data.
2. **Create/drop role** (`command_role`): "New role" form, "Drop" button behind a confirmation modal
   (React modal in your own tree; `confirm()` is blocked by the sandbox).
3. **Create/drop person** (`command_user`): form with just a name (people never log in, see A3). The trigger also creates the `metabase_reader` `SET ROLE` grant.
4. **Add/remove membership** (`command_membership`): add/remove on the memberships lists from B6.5.
5. **Errors:** show `error.data.message` verbatim in a `<pre style={{whiteSpace:"pre-wrap"}}>`. Postgres
   errors (e.g. "role cannot be dropped because some objects depend on it") are the useful information.
6. **Guardrails in the UI:** disable editing for reserved roles (`postgres`, `metabase_reader`,
   superusers); disable buttons while `isExecuting` to avoid double-submits.

Declare each action in `actions/<topic>.action.ts` with `defineAction({ action: schema.models.<m>.actions.create })`
and call `useAction(TheAction)` (imported from `@metabase/embedding-sdk-react/data-app`). Re-run
`npm run build` after adding any definition.

**Test early:** if the `sample_dwh` connection is later put under connection impersonation, action writes
run as the impersonated role and will fail unless that role can `INSERT` into the command tables.

## 6. Open questions to answer as we go
- If the `database=` typed schema is missing the views, does publishing them to the Data library fix it? (B5)
- Do implicit "create" actions work cleanly on our command tables (auto columns `id`, `requested_at`)? (B3/B8)
- Does `v_grants` show correct data for `metabase_reader`? (A2)
- Read-only vs read-write remote-sync mode for an app-only repo: confirm which behaves better. (B2)

## Status log
- 2026-09-23: Confirmed the data-apps feature works on the 1.64.0.1-beta local stack (port 3310, separate test stack). Decisions:
  local-only demo (no stats port), source lives in this GitHub repo, remote sync connects to it over HTTPS
  (this repo has its own stack). This repo is now a single-purpose stack + data app: compose uses the published
  `v1.64.0.1-beta` image (no source build), README rewritten. Removed the stats/portability section; updated B1, B2, B3,
  B4 (skills tag, agent option), B5 (no library needed), B7 (non-admin test).
- 2026-08-03: Plan approved. Starting Part A (docker stack).
- 2026-09-21: Draft of Part A files committed in `init` but unverified. Scope narrowed to the Postgres side
  only (no Metabase-user-to-role mapping). Plan rewritten with step-level detail; added Step 0 (token/image),
  `v_grants` fix, trigger hardening, and portability notes.
- 2026-09-25: Demo warehouse grown to 104 tables (`public`, `staging`, `analytics`). Edit mode built for
  grants and memberships: `command_grant` now allows only SELECT, and `table_name = '*'` grants or
  revokes every table in a schema plus USAGE. Two actions (`CreateGrant`, `CreateMembership`) run through
  the app's copied models; verified end to end, including the Postgres error path. UI now says "database
  role" and "database object" throughout. Still to do: create and drop database roles, the
  create-person trigger, and the TODOs under B5.1.
- 2026-09-25 (later): Replaced the immediate-save Edit mode with a queue and an Apply bar. Added the
  Database Roles tab with add and delete database role panels (`command_role` actions are now
  `create_person`, `create_functional`, and `drop`; the trigger sets the kind comment, lets the connection
  role SET ROLE to new people, and revokes everything before dropping). Open idea, not built: show the SQL a
  change runs. Two feasible routes: generate the same statement text in the app as a preview before Apply, and
  add an `executed_sql` column that the trigger fills, which the action's returned row would then carry back.
- 2026-09-25 (later still): Prefixes changed to `imp_fn_rl_` and `imp_pr_rl_`; kind now comes from the prefix, not a
  role comment. 63-character limit enforced in the form and the trigger. Deleting a role needs its full name
  typed. `command_user` retired: table and trigger dropped, its Metabase model archived (recoverable from the
  trash). The plan's older `command_user` notes above no longer apply.
- 2026-09-25 (later still): Three tabs now: Permissions, Database Role Mappings (membership editing), and
  Manage Database Roles (list with Delete, and an Add button that opens a dialog). Deleting shows who is
  affected and needs the role name typed. Open question, answered in chat but not built: recording each
  command's status in its row. In one transaction a failed statement rolls the whole insert back, so failure
  can't be recorded without catching the error in a PL/pgSQL EXCEPTION block and writing status = 'failed'.
- 2026-09-25 (batch): Replaced the three command tables with one, `command_batch`. Apply now sends the whole
  queue as one row; a trigger applies each change in one transaction, verifies each in the system catalog,
  and records `applied` or `failed` (with per-change results and the SQL run) in the same row, so a change
  either fully happens or not at all, and the record survives a page reload (the "Last save" section reads
  `v_batches`). Verified: success, failure with full rollback, malformed input, forged status, a 174 KB
  batch, and the flow through the app's copied action. The old command tables, triggers, and models are
  retired. Known caveat: regenerating the typed schema after a build suffixes duplicated model names.
