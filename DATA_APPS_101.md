# Data apps 101: a Postgres access manager inside Metabase

This guide is for developers who know Metabase but are new to data apps, React, and git-based remote sync. It records what this repo does, why each piece exists, and the problems we hit along the way. The design and the concepts (React, hooks, models, actions) live in [PLAN.md](PLAN.md), so this guide links there instead of repeating them.

## What you're building

A data app is a small React app that Metabase serves at `/apps/<slug>`. This one lets an admin view and change the Postgres side of access control: which database roles exist, what each database role can read on each database object, and which person database roles belong to which functional database roles.

Two things about how data apps behave surprised us:

- **The app is a standalone page.** Metabase shows it without the top navigation or sidebar. The app runs in an iframe that fills the page, so your app draws its own header and navigation.
- **Delivery goes through git.** You never upload an app. You commit the built bundle, push, and pull in Metabase, which caches the bundle and serves it to browsers.

## Find your way around the repo

**Edit** means you change it. **Boilerplate** means leave it alone. **Generated** means a tool writes it, so commit it but don't edit it by hand.

### Repo root

| File                 | Use                                                      |                                 |
| -------------------- | -------------------------------------------------------- | ------------------------------- |
| `.env.example`       | Template of the settings the stack needs                 | Edit rarely                     |
| `.gitignore`         | Files git skips (`.env`, `node_modules/`)                | Edit rarely                     |
| `PLAN.md`            | The build plan and concepts                              | Edit                            |
| `DATA_APPS_101.md`   | This guide                                               | Edit                            |
| `README.md`          | Quick start for the repo                                 | Edit                            |
| `docker-compose.yml` | The stack: Metabase, its app database, and the warehouse | Edit rarely                     |

### `seed/` (runs on the first boot of an empty database)

| File                                                 | Use                                                             |                        |
| ---------------------------------------------------- | --------------------------------------------------------------- | ---------------------- |
| `seed/metabase/config.yml`                           | Creates the admin, the API key, and the `sample_dwh` connection | Edit rarely            |
| `seed/sample-dwh/001_seed.sql`                       | The demo warehouse: about 100 tables in three schemas           | Edit rarely            |
| `seed/sample-dwh/002_fine_grained_access_reads.sql`  | The four read views                                             | Edit                   |
| `seed/sample-dwh/003_fine_grained_access_writes.sql` | The four command tables and their triggers                      | Edit (hardening to do) |
| `seed/sample-dwh/004_create_metabase_role.sh`        | Creates `metabase_reader` and its permissions                   | Edit rarely            |
| `seed/sample-dwh/005_demo_roles.sql`                 | Demo roles, people, and grants                                  | Edit                   |
| `seed/sample-dwh/006_demo_impersonation.sql`         | Lets `metabase_reader` switch to each person role               | Edit rarely            |

### `data_apps/app-fine-grained-access/` (the app)

| File                      | Use                                                               |                                |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------ |
| `data_app.yaml`           | App name, description, and bundle path; Metabase reads it on sync | Edit rarely                    |
| `package.json`            | Dependencies and scripts                                          | Edit rarely (npm edits it too) |
| `package-lock.json`       | Exact dependency versions                                         | Generated                      |
| `tsconfig.json`           | TypeScript settings                                               | Boilerplate                    |
| `vite.config.ts`          | Build settings, one line from the SDK                             | Boilerplate                    |
| `.gitignore`              | App-level ignores                                                 | Boilerplate                    |
| `LICENSE`                 | The template's license                                            | Boilerplate                    |
| `README.md`               | The data app template's own readme                                | Boilerplate                    |
| `scripts/windows-fix.cjs` | Lets the SDK's build tool run on Windows                          | Boilerplate                    |
| `src/index.tsx`           | Entry point that hands the app to Metabase                        | Boilerplate                    |
| `src/App.tsx`             | The main screen, currently "Hello"                                | Edit (your main file)          |
| `src/theme.ts`            | Colors and fonts for Metabase-rendered pieces                     | Edit rarely                    |
| `src/app.css`             | Colors for light and dark mode, cards, and rows                   | Edit                           |
| `src/components/`         | Screen pieces: three tabs, the tree, role lists, dialogs, and icons | Edit                           |
| `src/lib/`                | `access.ts` (who can read what) and `nodes.ts` (the tree)         | Edit                           |
| `src/metabase.data.ts`    | Your tables, views, models, and actions as TypeScript             | Generated                      |
| `queries/`, `actions/`    | One file per topic; the hooks accept only what's declared here    | Edit (your files go here)      |
| `resources_metadata.json` | Links the app to its Metabase collection and queries              | Generated                      |
| `dist/index.js`           | The built bundle Metabase runs                                    | Generated (rebuild and commit) |

Two files aren't in git: `.env` holds the stack's passwords and license token, and `.env.local` holds the API key the app's build tools use.

## Build the database side first

The app can only read tables and views that Metabase has synced, and it can only write through Metabase actions. Actions bind values into SQL, so they can't build a `GRANT` statement, because table and role names are identifiers. So every read is a view, and every write is an insert into a command table that a trigger turns into the real statement.

**Reads.** `v_roles`, `v_grants`, `v_memberships`, and `v_schema_tree` show roles, direct grants, memberships, and the table tree. They show only roles whose names start with `imp_fn_rl_` (a functional role) or `imp_pr_rl_` (a person role), where `imp` is impersonation, `fn` functional, `pr` person, and `rl` role. Superusers, Postgres's built-in `pg_*` roles, and `metabase_reader` never appear. That's a rule, not a list of names, so a new superuser can't leak in. The prefix also says which kind a role is, so nothing else has to be stored. The command triggers enforce the same prefixes, so even a command row inserted by hand can't create, drop, or change any other role.

**Writes.** `command_role`, `command_grant`, and `command_membership` are the three command tables. The `command_` prefix keeps them together in Metabase's table list.

**People never log in.** Metabase impersonates a person by running `SET ROLE <person>`, so person roles need no password and no login. That makes the login flag useless for telling people from functional roles, so each role carries a Postgres comment (`person` or `functional`) that `v_roles` reads. We say "functional role" instead of "group" because Metabase already uses "group" for its own permission groups.

**Name columns need a cast.** Postgres stores names in a special `name` type, and Metabase types those columns as `unknown`. Filters on them would be untyped in the app, so the views cast them to text. We only noticed after generating the schema, so if a new column shows up as `unknown`, look for the same cause.

**Schema name.** The schema is `fine_grained_access` in snake case. A mixed-case name would need double quotes in every SQL statement.

**The demo warehouse.** `001_seed.sql` builds something that looks like a real warehouse, so the tree has enough in it to be worth filtering. `public` has ten unrelated application tables, such as settings and audit logs. `staging` has 58 wide, denormalized tables loaded from source systems, grouped by area with a prefix: `sales_`, `marketing_`, `hr_`, `payroll_`, `finance_`, and `inventory_`. `analytics` is the modeled layer, with 16 `dim_` dimensions (date, product, region, customer, person, department, and so on) and 20 `fct_` facts (sales, recruitment, retention, productivity, payroll, general ledger, inventory, and so on). Each table is one line in a list, and a small function guesses column types from their names, for example `_id` and `_key` become integers, `_date` a date, and `_amount` a decimal. Most tables are empty. Only the small dimensions, such as `dim_date`, `dim_region`, and `dim_department`, have rows. The `fine_grained_access` schema holds the app's own plumbing, so the tree never lists it and the grant trigger refuses to give any role access to it.

**Demo data.** `005_demo_roles.sql` creates three functional roles (`imp_fn_rl_sales`, `imp_fn_rl_finance`, `imp_fn_rl_hr`) and six people (`imp_pr_rl_alice` through `imp_pr_rl_frank`), with two of them in two roles each and one in none. `006_demo_impersonation.sql` grants each person to `metabase_reader` with `inherit false, set true`. That lets Metabase switch to a person without `metabase_reader` inheriting their privileges. In a real deployment, the connection role needs this grant for every person, so the "create person" trigger should do it.

If you reset the database volume, the seed scripts run again automatically. Restarting the containers keeps your data and doesn't rerun them.

## Prepare Metabase

Do these once, in the admin UI.

1. On the `sample_dwh` connection, turn on **Model actions**. Sync the database schema after any change to the views or tables.
2. Create one model for each command table. The button is the **+** on the **Models** page, not in the **New** menu. Save them in a collection, here `FineGrainedAccess`.
3. Open each model, go to its **Actions** tab, and choose **Create basic actions**. The app only calls the `create` action.
4. Restrict the collection. Metabase let every signed-in person run actions in it, and these actions create roles and grants. Set **All Users** to **No access**. Administrators keep access.

Metabase also needs to read the command tables to sync them and build models over them, so `metabase_reader` has `SELECT` as well as `INSERT` on them.

## Connect the git repo

Create a GitHub fine-grained token limited to this repo, with **Contents** set to read-only. In **Admin → Settings → Remote sync**, enter the repo URL, the token, and the branch `main`. Choose the pull-only sync type if Metabase offers it.

An app whose bundle isn't in the repo shows **Sync failed**. That's what happened after the first pull: the source was committed but `dist/index.js` wasn't, and Metabase reported that the bundle wasn't found. Build, commit `dist/index.js`, push, and pull again.

## Scaffold the app

The app folder name is the app's URL, and Metabase accepts only lowercase letters, numbers, and single dashes. That's why the folder is `app-fine-grained-access` and not `app_fine_grained_access`.

Copy the template from the Metabase repo (`skills/metabase-data-app-setup/template/`), then adjust it:

- Install the SDK with `npm install @metabase/embedding-sdk-react@64-beta`.
- Remove `dist` and the lockfiles from the app's `.gitignore`. Metabase serves the committed bundle, and the lockfile keeps installs reproducible.
- Put `DATA_APP_MB_URL` and `DATA_APP_MB_API_KEY` in `.env.local` at the repo root. It's git-ignored, and the build tools use the key to talk to Metabase.

**Windows build fix.** `npm run build` crashed on Windows with `ERR_INVALID_FILE_URL_PATH`. The SDK's command-line tool has a Linux file path from Metabase's build machine baked in, and Windows rejects it at startup. `scripts/windows-fix.cjs` makes that one call tolerant, and `package.json` runs the tool through it. It does nothing on Linux or macOS. Delete it once the SDK is fixed.

**Local preview.** Run `npm run dev` from inside `data_apps/app-fine-grained-access/`, not from the repo root, because that's where `package.json` lives. It serves the app at `http://localhost:5174`. The same goes for `npm run build` and `npm run typecheck`. Metabase always allows `localhost` origins, so adding that address to the CORS setting is optional locally. We haven't needed any embedding toggle. Expect that to change only if the preview fails to sign in.

## Generate the typed schema

`src/metabase.data.ts` is generated, never hand-built. Metabase itself writes it: you ask its API for a description of your database, and it answers with a TypeScript file. It's a catalog of what your app is allowed to use, so your editor can autocomplete names and the type-checker can catch a typo like `schema.tables.vRole` before you run anything.

The file has three parts. `tables` lists each table or view with its fields, and every field carries its column name, its type (`jsType`), and Metabase's ids for it. `models` lists each model with its actions (`create`, `update`, `delete`), and every action carries its id and its parameters (name, type, and whether it's required). `metrics` is empty here because we haven't defined any. At the bottom, `schema` bundles the three with the time it was generated and the Metabase URL it came from.

Because it holds ids from one instance, it belongs to that instance. Commit it, but don't edit it. To change it, change Metabase (add a column, a model, or an action) and generate it again. Your queries and actions import from it with `import schema from "../src/metabase.data"`.

Run this from the repo root to write the schema file. It uses the API key from `.env.local`:

```
curl -o data_apps/app-fine-grained-access/src/metabase.data.ts \
  -H "x-api-key: $DATA_APP_MB_API_KEY" -H "Accept: text/typescript" \
  "$DATA_APP_MB_URL/api/typed-schemas/v1/typescript?database=sample_dwh&include-models=true"
```

The `database` parameter limits it to one database, and `include-models=true` adds the models and their actions. You don't need library collections, metrics, or segments for this app. Regenerate the file whenever the views, tables, or models change. The file lists every table in the database, including ones this app never uses, so it grows with the warehouse. After we replaced the small demo tables with a 100-table warehouse, we chose not to regenerate it: the app only reads the `fine_grained_access` views and models, and those didn't change.

Open the result and check for three things: the views under `tables` (`vRoles`, `vGrants`, `vMemberships`, `vSchemaTree`), the four models under `models` with a `create` action each, and `string` as the type of every name column.

## Keep the app working when the database changes

Adding a column doesn't break a deployed app. The app keeps using the fields it already knew about and doesn't see the new one until you regenerate the schema. Removing or renaming a column, or dropping a table, does break it: Metabase stops finding that field, and any query that uses it fails when the app runs. A deployed app keeps serving its last good bundle, so people see an error in the affected panel until you fix it. That's Metabase's usual behavior, and we haven't tested it here.

Metabase matches tables and fields by name, so it keeps their ids when you recreate one with the same names. We saw this ourselves: after we dropped and recreated `v_roles` with different column types and synced, `v_roles` and its fields kept the same ids. A rename looks like a removal plus a new column, so it gets a new id.

After any database change, do this in order:

1. In Metabase, sync the database schema and rescan field values (**Admin → Databases → your database**).
2. Regenerate `metabase.data.ts` with the command above.
3. From the app folder, run `npm run typecheck`. If a field the app uses is gone, it's gone from the regenerated file too, and the type-checker points at every line that still uses it.
4. Fix those lines, run `npm run build`, commit, push, and pull in Metabase.

Skip step 3 and you find out when a person opens the app.

## Call external APIs only if you must

A data app runs sandboxed and can't call any outside host. To allow one, list its origin under `allowed_hosts` in `data_app.yaml`. You never list Metabase itself, because the SDK reaches it for you. This app talks only to Metabase, so it leaves the list out. Prefer a client-side form handler over a native `<form action>`, which navigates the sandboxed page away from your app.

## Write the first query and screen

A data app splits reading data into two files. The query is a declaration in `queries/`, and the screen that uses it is a React component in `src/`.

`queries/roles.query.ts` declares one query with `defineQuery`: read the `vRoles` view and sort by role name. The hooks accept only queries declared in this folder, and the build copies each one into the app's own Metabase collection so people who use the app can run it. You describe the query with entries from the generated schema (`schema.tables.vRoles`), not with SQL or raw ids.

`src/App.tsx` calls `useMetabaseQuery(Roles)`, a React hook that runs the query and returns three things: `data` (the rows), `isLoading`, and `error`. Rendering all three matters, because the first render happens before the data arrives. The screen shows a loading message while it waits, the error text if the query fails, and "No roles yet" if the list is empty. Each row is an object keyed by column name, so `row.role_name` is a role's name. The code reads those key names from the schema instead of typing the strings, so a rename can't slip past the type-checker.

Preview it from the app folder with `npm run dev`, then open `http://localhost:5174`.

`npm run build` does more than bundle. First it copies each query into the app's own Metabase collection as a saved question, so people who use the app can run them, and it writes that question's id into the query file as `savedQuestionSourceId`. Don't delete or edit that line. The build refuses to bundle a query that hasn't been synced, which is why even a plain `vite build` fails until you've run the full build once. Commit the changed query files and `resources_metadata.json` with the bundle.

## Show who can read what and who is in what

The app has two tabs, and each has a switch that turns the same data around.

**The Permissions tab** answers "who can read what". The first view, **By database object**, shows a tree on the left with the database at the top, then its schemas, then their tables, each with an icon. Selecting a node lists every database role on the right, functional database roles first and then person database roles. The second view, **By database role**, flips it: pick a database role on the left and see the whole tree with an icon on every row showing what that role can read.

**The Database Role Mappings tab** answers "who is in what". **By functional database role** lists the person database roles in one, and **By person database role** lists the functional database roles a person belongs to.

**Icons show the state, and hovering explains it.** A solid blue check means the role has the access itself. A grey ring with a check means the access comes through another role. A half-filled ring, on a schema or the database, means the role can read some of the tables underneath. An empty ring means no access. The icons are circles, not boxes, so they don't look clickable. Role names and counts appear only on hover, for example "Can read 1 of 2 tables through finance". The solid and empty states are square checkboxes you can click, and the grey ones stay locked, because you change that access on the functional database role. The next section covers how clicking works.

**The look follows Metabase and your system setting.** `src/app.css` holds the colors, borrowed from Metabase's own light and dark themes: the same near-black and near-white neutrals, and the same brand blue. A media query (`prefers-color-scheme`) switches between them, so the app matches your operating system's light or dark mode. Every color is a CSS variable, including the icons, so nothing is hard-coded per mode. Panels are rounded cards, and the page and text follow the theme. Two limits: the iframe can't see the theme you pick inside Metabase, only the system setting, and the app asks for Metabase's Lato font but falls back to your system font, because a sandboxed app can't load fonts from outside.

**Role names show in full.** The shared prefix (`imp_fn_rl_` or `imp_pr_rl_`) is dimmed, so the part that differs stands out. The full name is what a Metabase user attribute has to contain, so the app never hides it.

**Long lists stay manageable.** Schemas start collapsed, and selecting a schema or table opens its schema, so the tree stays short until you open something. We didn't make other schemas close when you open one, because people compare schemas and a tree that jumps is disorienting. A filter box above the tree narrows it to matching schemas and tables as you type, and it opens the schemas that have a match. Each card is a fixed 55 percent of the window tall, with a minimum, and shows a scrollbar when its content is taller. That keeps the size steady when you expand a schema, and a long tree never stretches the page. On a narrow window the two cards stack. The layout is deliberately plain. We first tried headers pinned to the top of a card and cards sized to fill the window, and both behaved differently from one screen to the next: a pinned header with negative margins covered the first line beneath it. The plain version uses normal block layout and one flex row, which behaves the same in every browser.

Two limits to check on a large warehouse. Metabase commonly caps unaggregated query results at around 2,000 rows unless a limit is set, and we haven't verified what the data-app query hook does. A capped result would show incomplete access with no warning. The screen also recalculates every role's access on each render, which is fine for hundreds of tables but would need caching for thousands.

**The rules live in two plain files.** `src/lib/access.ts` takes the direct grants and the memberships and answers "can this role read this table, and through which roles?". It follows memberships through other roles, and it has no React in it. We checked its answers against Postgres's own `has_table_privilege()` for every person, and they matched. `src/lib/nodes.ts` describes a place in the tree (the database, a schema, or a table) and finds the tables under it.

**Four queries, each called once.** `App.tsx` runs the roles, grants, memberships, and tables queries, builds one `model` object from the results, and hands it to both tabs. A query hook shouldn't run twice for the same data, which is why the data lives at the top and the components below receive it as props. The grants query has its `SELECT` filter inside the declaration because it never changes. A filter that changes while the app runs, such as a selected role, goes in the hook's second argument.

**Each screen keeps its own selection.** React holds a selection with `useState`, and changing it redraws the screen. `App.tsx` keeps both tabs mounted and hides the inactive one, so switching tabs doesn't forget what you picked.

## Queue changes, then apply them

Nothing you click changes the database. A click queues a change, and the change only runs when you press **Apply changes**. That means a mistaken click costs nothing: you can remove it from the list, discard the whole list, or just never press Apply.

**Queued changes show up on the screen straight away.** The app draws the database as it would look once the queue has run, and marks anything a queued change would alter with a dashed amber outline. Remove a person from a functional database role, and the grey rings they had through it disappear from the Permissions tab with the dashed outline still on, so you can see the effect before you commit to it. A role queued to be created appears in the lists with a **new** badge.

**The Apply bar lives at the bottom of the window.** It appears when something is queued and shows how many changes are waiting. Open it to read them in plain English, for example "Give imp_pr_rl_frank read access to every table in staging", and to remove single ones. **Discard** throws the list away, and **Apply changes** runs it.

**Squares are clickable and circles are read-only.** Square checkboxes queue a change. Circles are access that comes through another role, so you change it on that role instead.

**What you can queue**
- **Grant or revoke read access.** A checkbox next to a database role queues access to a table, a schema, or the whole database. On a schema it covers every table in it, and on the database it does that for each schema.
- **Add or remove a membership.** On the Database Role Mappings tab, checkboxes put a person database role into a functional database role, or take it out, from either side.
- **Add a database role.** The **Manage Database Roles** tab has an **Add database role** button at the top, which opens a dialog. It asks for a kind, functional or person, and a name. The app adds the matching prefix, so you type only the name you want. The whole name, prefix included, can't be longer than 63 characters, because Postgres silently cuts longer names. The dialog shows how many characters you have left, and refuses a name that is too long, uses anything but lowercase letters, numbers, and underscores, or already exists.
- **Delete a database role.** The same tab lists every database role, grouped by kind, with a **Delete** button on each. The button opens a dialog with a warning that says what else is affected. For a functional database role, it lists the person database roles that will be removed from it and lose the access they get through it. For a person database role, it lists the functional database roles it will leave. You then type the role's full name before the confirm button turns on. That queues the deletion, which also removes what the role can read. Deleting a role that only exists in the queue just takes its creation back out.

**Apply runs the list in order and stops at the first failure.** Each change is one action that inserts a row into a command table, and a database trigger turns the row into the real statement. If the database refuses one, the app shows its message as it is, keeps that change and everything after it in the list, and reloads whatever did run. Nothing is silently lost, and you can remove the change that failed or fix the cause and press Apply again.

**The screens update after Apply without a refresh.** The app never stores who can read what. It works that out in the browser from three lists it loaded: the roles, the direct grants, and the memberships. After Apply, it reloads those, and every screen that depends on them redraws. That's why removing a person from a functional database role updates the access on the Permissions tab.

**The queue has one rule about undoing.** Clicking the same table or membership twice in a row cancels itself out, so the list doesn't hold a grant followed by a revoke. Schema and database changes always stay in the list, because they cover many tables and taking one back doesn't undo the others. The final result is correct either way, because the list runs in order.

**The trigger enforces the rules, not the screen.** Only `SELECT` can be granted. Only roles starting with `imp_fn_rl_` or `imp_pr_rl_` can be created, dropped, granted to, or given members, and a person role must use `imp_pr_rl_` while a functional role uses `imp_fn_rl_`. The trigger also refuses names over 63 characters, because Postgres would otherwise cut them without saying so and create a role with a different name than the one asked for. Creating a person role also lets the connection role switch to it, which impersonation needs, and dropping a role first revokes everything it holds and refuses if it owns any database objects. A row inserted by hand is held to the same rules.

**Three actions, declared once.** `actions/grants.action.ts`, `actions/memberships.action.ts`, and `actions/roles.action.ts` each wrap the create action of one command-table model. The build copies those models into the app's own Metabase collection, so people who use the app can run the actions without access to the original models, which stay locked to admins. The build writes the copy's id into each file as `copiedActionId`. Don't edit that line.

**Dialogs handle the keyboard on themselves.** The sandbox the app runs in blocks keyboard listeners on the whole document, so the dialog catches the Escape key on its own element instead, and focus starts inside it. Clicking the dim area around a dialog also closes it.

**What it doesn't do yet.** Tables created after a schema was granted aren't covered, and we've left that for a separate project. The screen ignores grants to `PUBLIC` and doesn't show schema-level `USAGE`, so a database role could look like it has access to tables it can't reach.
