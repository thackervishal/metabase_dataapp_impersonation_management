# Data apps 101: a Postgres access manager inside Metabase

This guide is for developers who know Metabase but are new to data apps, React, and git-based remote sync. It explains what this repo does, why each piece exists, and the problems we ran into.

## What problem are we solving

Connection impersonation is Metabase's recommended way to give different people different data access through one shared database connection. Metabase runs each person's queries as a database role, and Postgres enforces access from there. Someone still has to manage that database side, and that's a recurring set of jobs. This app is the admin tool for them:

- **Database roles.** One functional role per team or need, such as sales, finance, or HR.
- **Person to role assignment.** Every Metabase user maps to a database role. A person can belong to more than one functional role, and that changes as people join, move, and leave.
- **Access rules.** What each role can read, direct or inherited through another role, and why. This answers the recurring question, "why does this person see this table?"
- **Row-level security.** Which rows a role sees, not just which tables.
- **Column-level security.** Which columns a role sees.
- **Auditing.** Who changed access, and when.

## What you're building

A data app is a small React app. Metabase serves it at `/apps/<slug>`. This one lets an admin view and change the Postgres side of access control. It covers three things: which database roles exist, what each role can read, and which person roles belong to which functional roles.

Data apps behave in two ways that are easy to miss:

- **The app is a standalone page.** Metabase shows it with no top navigation and no sidebar. The app runs in an iframe that fills the page. Your app has to draw its own header and navigation.
- **Delivery goes through git.** You never upload an app. You commit the built bundle, push it, and pull it in Metabase. Metabase caches the bundle and serves it to browsers.

## A few terms, if you're new to React

The rest of this guide explains Metabase-specific things, such as the sandbox, remote sync, models, actions, `defineQuery`/`defineAction`, the generated schema, and `sync-resources`, inline, where they first come up. These few are plain React and tooling terms it assumes instead:

| Term                   | Plain-English meaning                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **React**              | A JS library where UI is built from _components_: functions that return markup (JSX/TSX) describing what to show.                                    |
| **TSX / TypeScript**   | TypeScript is JS with types; `.tsx` files mix it with JSX markup. `npm run typecheck` runs the type checker (the dev server does not).               |
| **Props**              | Arguments passed into a component: `<RolePicker roles={roles} />`.                                                                                   |
| **State (`useState`)** | A value a component remembers between renders. Changing it re-renders the component.                                                                 |
| **Hook**               | A function starting with `use...` that plugs into React (or Metabase) features. Call hooks at the top level of a component, never in loops or `if`s. |
| **Vite**               | The dev server and bundler. `npm run dev` previews the app; `npm run build` produces one `dist/index.js` file.                                       |
| **Bundle**             | That single JS file. Metabase loads it, not your source. It must be committed to git.                                                                |

## Find your way around the repo

**Edit** means you change it. **Boilerplate** means leave it alone. **Generated** means a tool writes it. Commit it, but don't edit it by hand.

### Repo root

| File                 | Use                                                      |             |
| -------------------- | -------------------------------------------------------- | ----------- |
| `.env.example`       | Template of the settings the stack needs                 | Edit rarely |
| `.gitignore`         | Files git skips (`.env`, `node_modules/`)                | Edit rarely |
| `DATA_APPS_101.md`   | This guide                                               | Edit        |
| `README.md`          | Quick start for the repo                                 | Edit        |
| `docker-compose.yml` | The stack: Metabase, its app database, and the warehouse | Edit rarely |

### `seed/` (runs on the first boot of an empty database)

| File                                                 | Use                                                                       |                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| `seed/metabase/config.yml`                           | Creates the admin, the demo people, the API key, and the `dwh` connection | Edit rarely            |
| `seed/sample-dwh/001_seed.sql`                       | The demo warehouse: about 100 tables in three schemas                     | Edit rarely            |
| `seed/sample-dwh/002_fine_grained_access_reads.sql`  | The read views                                                            | Edit                   |
| `seed/sample-dwh/003_fine_grained_access_writes.sql` | The command table and its trigger                                         | Edit (hardening to do) |
| `seed/sample-dwh/004_create_metabase_role.sh`        | Creates `metabase_reader` and its permissions                             | Edit rarely            |
| `seed/sample-dwh/005_demo_roles.sql`                 | Demo roles, people, and grants                                            | Edit                   |
| `seed/sample-dwh/006_demo_impersonation.sql`         | Lets `metabase_reader` switch to each person role                         | Edit rarely            |
| `seed/sample-dwh/007_demo_row_security.sql`          | Turns on row security for two demo tables and adds policies               | Edit                   |

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
| `src/App.tsx`             | The main screen, with its five tabs                               | Edit (your main file)          |
| `src/theme.ts`            | Colors and fonts for Metabase-rendered pieces                     | Edit rarely                    |
| `src/app.css`             | Colors for light and dark mode, cards, and rows                   | Edit                           |
| `src/components/`         | Screen pieces: the tabs, the tree, role lists, dialogs, and icons | Edit                           |
| `src/lib/`                | `access.ts`, `nodes.ts`, `changes.ts`, `batch.ts`, `policies.ts`  | Edit                           |
| `src/metabase.data.ts`    | Your tables, views, models, and actions as TypeScript             | Generated                      |
| `queries/`, `actions/`    | One file per topic; the hooks accept only what's declared here    | Edit (your files go here)      |
| `resources_metadata.json` | Links the app to its Metabase collection and queries              | Generated                      |
| `dist/index.js`           | The built bundle Metabase runs                                    | Generated (rebuild and commit) |

One file isn't in git: `.env`. You create it by copying `.env.example` and adding your license token. It holds the stack's passwords, the admin API key, and the URL and key the app's build tools use. Nothing else needs setting up.

## Build the database side first

The app can only read tables and views that Metabase has synced. It can only write through Metabase actions. Actions bind values into SQL. They can't build a `GRANT` statement, because table and role names are identifiers, not values. So every read goes through a view. Every write is an insert into a command table, and a trigger turns that insert into the real SQL statement.

**Reads.** `v_roles`, `v_grants`, `v_memberships`, and `v_schema_tree` show roles, direct grants, memberships, and the table tree. They only show roles whose names start with `imp_fn_rl_` (a functional role) or `imp_pr_rl_` (a person role). `imp` means impersonation, `fn` means functional, `pr` means person, and `rl` means role. Superusers, Postgres's own `pg_*` roles, and `metabase_reader` never show up. This is a rule, not a list of names to exclude, so a new superuser can't leak in by accident. The prefix also tells you which kind of role it is, so the app doesn't store that separately. The command triggers check the same prefixes. Even a command row inserted by hand can't create, drop, or change any role outside this set.

**Writes.** There is one command table, `command_batch`. The app inserts one row holding everything a person queued. A trigger applies each change in order, checks that it took effect, and records the result in the same row. All of this happens in one transaction. The functions that do the actual work, `apply_grant`, `apply_membership`, and `apply_role`, can't be called directly by a client.

**People never log in.** Metabase impersonates a person by running `SET ROLE <person>`. Person roles need no password and no login. So the login flag can't tell a person role from a functional role. Instead, each role carries a Postgres comment, `person` or `functional`, and `v_roles` reads that comment. This guide says "functional role," not "group." Metabase already uses "group" for its own permission groups, and that would be confusing here.

**Name columns need a cast.** Postgres stores names in a special `name` type. Metabase types those columns as `unknown`. A filter on an `unknown` column would be untyped in the app, so the views cast those columns to text. We found this problem only after generating the schema. If a new column shows up as `unknown`, look for the same cause.

**Schema name.** The schema is `fine_grained_access`, in snake case. A mixed-case name would need double quotes in every SQL statement.

**The demo warehouse.** `001_seed.sql` builds a warehouse that looks real, with enough tables to be worth filtering. `public` has ten unrelated application tables, such as settings and audit logs. `staging` has 58 wide, denormalized tables loaded from source systems. Each one has a prefix for its area: `sales_`, `marketing_`, `hr_`, `payroll_`, `finance_`, or `inventory_`. `analytics` is the modeled layer. It has 16 `dim_` dimensions, such as date, product, region, customer, person, and department. It has 20 `fct_` facts, such as sales, recruitment, retention, productivity, payroll, general ledger, and inventory. Each table is one line in a list. A small function guesses each column's type from its name: `_id` and `_key` become integers, `_date` becomes a date, `_amount` becomes a decimal. Most tables are empty. Only the small dimensions have rows, such as `dim_date`, `dim_region`, and `dim_department`. The `fine_grained_access` schema holds the app's own plumbing. The tree never lists it, and the grant trigger refuses to give any role access to it.

**Demo data.** `005_demo_roles.sql` creates three functional roles: `imp_fn_rl_sales`, `imp_fn_rl_finance`, and `imp_fn_rl_hr`. It also creates six people: `imp_pr_rl_bruce`, `imp_pr_rl_frodo`, `imp_pr_rl_carol`, `imp_pr_rl_thor`, `imp_pr_rl_erin`, and `imp_pr_rl_frank`. Two of them belong to two roles each. One belongs to none. Bruce, Thor, and Frodo also have matching Metabase logins (see `seed/metabase/config.yml` and `scripts/setup-app.mjs`); the person role and the login share a name on purpose. `006_demo_impersonation.sql` grants each person role to `metabase_reader`, with `inherit false, set true`. This lets Metabase switch to a person without `metabase_reader` inheriting that person's privileges. A real deployment needs this same grant for every person role. The "create person" trigger should do this step automatically.

If you reset the database volume, the seed scripts run again automatically. Restarting the containers keeps your data and doesn't rerun them.

## Prepare Metabase

On a new machine, `node scripts/setup-app.mjs` does all of this for you. It also builds the app and imports it. See the README. The steps below show what the script does, and how to do them by hand if you prefer. Do these once, in the admin UI.

1. On the `dwh` connection, turn on **Model actions**. Sync the database schema after any change to the views or tables.
2. Create one model for the `command_batch` table. The button is the **+** on the **Models** page, not in the **New** menu. Save it in a collection, here `FineGrainedAccess`.
3. Open the model, go to its **Actions** tab, and choose **Create basic actions**. The app only calls the `create` action.
4. Restrict the collection. By default, Metabase lets every signed-in person run actions in it, and these actions create roles and grants. Set **All Users** to **No access**. Administrators keep access.

Metabase also needs to read the command table, to sync it and build a model over it. So `metabase_reader` has `SELECT` as well as `INSERT` on it.

## Connect the git repo

Create a GitHub fine-grained token limited to this repo. Set **Contents** to read-only. In **Admin → Settings → Remote sync**, enter the repo URL, the token, and the branch `main`. Choose the pull-only sync type if Metabase offers it.

An app whose bundle isn't in the repo shows **Sync failed**. This happened to us on the first pull: we had committed the source, but not `dist/index.js`. Metabase reported that it couldn't find the bundle. The fix: build, commit `dist/index.js`, push, and pull again.

## Scaffold the app

The app folder name becomes the app's URL. Metabase only accepts lowercase letters, numbers, and single dashes in that name. This is why the folder is `app-fine-grained-access`, not `app_fine_grained_access`.

Copy the template from the Metabase repo (`skills/metabase-data-app-setup/template/`), then adjust it:

- Install the SDK with `npm install @metabase/embedding-sdk-react@64-beta`.
- Remove `dist` and the lockfiles from the app's `.gitignore`. Metabase serves the committed bundle. The lockfile keeps installs reproducible.
- The build tools read `DATA_APP_MB_URL` and `DATA_APP_MB_API_KEY` from `.env` at the repo root. `.env.example` already has them, with the same demo key Metabase creates on first boot. They use the key to talk to Metabase.

**Windows build fix.** `npm run build` crashed on Windows, with the error `ERR_INVALID_FILE_URL_PATH`. The cause: the SDK's command-line tool has a Linux file path baked in, from Metabase's own build machine. Windows rejects that path at startup. `scripts/windows-fix.cjs` makes that one call tolerant of it, and `package.json` runs the tool through this fix. It does nothing on Linux or macOS. Delete it once the SDK itself is fixed.

**Local preview.** Run `npm run dev` from inside `data_apps/app-fine-grained-access/`, not from the repo root. That's where `package.json` lives. The same is true for `npm run build` and `npm run typecheck`. `npm run dev` serves the app at `http://localhost:5174`. Metabase always allows `localhost` origins, so you don't need to add that address to the CORS setting locally. We haven't needed to turn on any embedding toggle either. If the local preview fails to sign in, that's the first setting to check.

## Generate the typed schema

`src/metabase.data.ts` is generated. Never hand-build it. You ask Metabase's API for a description of your database, and Metabase answers with a TypeScript file. This file is a catalog of what your app is allowed to use. Your editor can autocomplete names from it. The type-checker can catch a typo, such as `schema.tables.vRole`, before you run anything.

The file has three parts. `tables` lists each table or view, with its fields. Every field carries its column name, its type (`jsType`), and Metabase's id for it. `models` lists each model, with its actions: `create`, `update`, `delete`. Every action carries its id and its parameters: name, type, and whether it's required. `metrics` is empty here. This app hasn't defined any metrics. At the bottom, `schema` bundles the three parts together, with the time it was generated and the Metabase URL it came from.

This file holds ids from one specific Metabase instance, so it belongs to that instance. Commit it, but don't edit it by hand. To change it, change Metabase instead: add a column, a model, or an action, then generate the file again. Your queries and actions import from it with `import schema from "../src/metabase.data"`.

Run this from the repo root to write the schema file. It uses the API key from `.env`:

```
curl -o data_apps/app-fine-grained-access/src/metabase.data.ts \
  -H "x-api-key: $DATA_APP_MB_API_KEY" -H "Accept: text/typescript" \
  "$DATA_APP_MB_URL/api/typed-schemas/v1/typescript?database=dwh&include-models=true"
```

The `database` parameter limits the result to one database. `include-models=true` adds the models and their actions. This app doesn't need library collections, metrics, or segments. Regenerate the file whenever the views, tables, or models change. The file lists every table in the database, including ones this app never uses, so it grows as the warehouse grows. When we replaced the small demo tables with a 100-table warehouse, we chose not to regenerate the file: the app only reads the `fine_grained_access` views and models, and those hadn't changed.

Open the result and check three things: the views under `tables` (`vRoles`, `vGrants`, `vMemberships`, `vSchemaTree`), the models under `models` with a `create` action each, and `string` as the type of every name column.

## Keep the app working when the database changes

Adding a column doesn't break a deployed app. The app keeps using the fields it already knows about. It won't see the new column until you regenerate the schema. Removing or renaming a column, or dropping a table, does break the app: Metabase stops finding that field, and any query that uses it fails when the app runs. A deployed app keeps serving its last good bundle, so people only see an error in the affected panel, until you fix it. This is Metabase's usual behavior. We haven't tested it ourselves in this repo.

Metabase matches tables and fields by name, so it keeps the same id when you recreate one with the same name. We saw this directly: we dropped and recreated `v_roles` with different column types, synced, and `v_roles` and its fields kept their old ids. A rename is different. Metabase reads it as a removal plus a new column, so it gets a new id.

After any database change, do this in order:

1. In Metabase, sync the database schema and rescan field values (**Admin → Databases → your database**).
2. Regenerate `metabase.data.ts` with the command above.
3. From the app folder, run `npm run typecheck`. If a field the app uses is gone, it's gone from the regenerated file too, and the type-checker points at every line that still uses it.
4. Fix those lines, run `npm run build`, commit, push, and pull in Metabase.

If you skip step 3, you find out when a real person opens the app.

## Call external APIs only if you must

A data app runs sandboxed. It can't call any outside host. To allow one, list its origin under `allowed_hosts` in `data_app.yaml`. Never list Metabase itself; the SDK reaches it for you automatically. This app only talks to Metabase, so it leaves that list empty. Prefer a client-side form handler over a native `<form action>`. A native form action navigates the sandboxed page away from your app.

## Write the first query and screen

A data app splits reading data into two files. The query is a declaration, in `queries/`. The screen that uses it is a React component, in `src/`.

`queries/roles.query.ts` declares one query, with `defineQuery`. It reads the `vRoles` view and sorts by role name. The hooks only accept queries declared in this folder. The build copies each one into the app's own Metabase collection, so people using the app can run it. You describe the query with entries from the generated schema, such as `schema.tables.vRoles`. You never write SQL or raw ids here.

`src/App.tsx` calls `useMetabaseQuery(Roles)`, a React hook. It runs the query and returns three things: `data` (the rows), `isLoading`, and `error`. You must render all three. The first render happens before the data arrives. The screen shows a loading message while it waits, the error text if the query fails, and "No roles yet" if the list is empty. Each row is an object, keyed by column name, so `row.role_name` holds a role's name. The code reads those key names from the schema, instead of typing the strings by hand, so a rename can't slip past the type-checker.

Preview it from the app folder with `npm run dev`, then open `http://localhost:5174`.

`npm run build` does more than bundle the app. First, it copies each query into the app's own Metabase collection, as a saved question, so people using the app can run them. It then writes that question's id into the query file, as `savedQuestionSourceId`. Don't delete or edit that line. The build refuses to bundle a query that hasn't been synced this way, which is why even a plain `vite build` fails until you've run the full build once. Commit the changed query files and `resources_metadata.json` together with the bundle.

## Show who can read what and who is in what

The app has five tabs. Two of them, Permissions and Database Role Mappings, each have a switch that turns the same data around.

**The Permissions tab** answers "who can read what." It has two views. **By database role** comes first: pick a database role on the left, and the tree on the right shows an icon on every row for what that role can read. **By database object** flips this around: a tree on the left shows the database, then its schemas, then their tables. Select a node, and the list on the right shows every database role, functional roles first, then person roles.

**The Database Role Mappings tab** answers "who is in what." **By functional database role** lists the person roles that belong to one functional role. **By person database role** lists the functional roles that one person belongs to.

**Each icon matches the role's state, and hovering explains it.** A solid blue check means the role has this access directly. This one shows as a clickable square checkbox, so you can revoke it. A grey ring with a check means the access comes through another role. This one is a locked circle, not clickable, because you change that access on the other role instead. A half-filled ring, on a schema or the database, means the role can read some of the tables underneath, not all; it's also a locked circle. An empty ring means no access, and it's a clickable square checkbox too, so you can grant it. Role names and counts only appear on hover, for example "Can read 1 of 2 tables through finance." The next section covers how clicking actually works.

**The look follows Metabase and your system setting.** `src/app.css` holds the colors. They're borrowed from Metabase's own light and dark themes: the same near-black and near-white neutrals, and the same brand blue. A media query, `prefers-color-scheme`, switches between them, so the app matches your operating system's light or dark mode, not a theme picked inside Metabase. Every color is a CSS variable, including the icons, so nothing is hard-coded per mode. Panels are rounded cards. The page and text follow the same theme. Two limits to know about: the iframe can't see the theme you picked inside Metabase, only your system setting, and the app asks for Metabase's Lato font but falls back to your system font, because a sandboxed app can't load fonts from outside.

**Role names show in full.** The shared prefix, `imp_fn_rl_` or `imp_pr_rl_`, is dimmed, so the part that differs stands out. The full name is what a Metabase user attribute must contain, so the app never hides it.

**Long lists stay manageable.** Schemas start collapsed, so the tree stays short until you open something. Selecting a schema or a table opens its schema too, so you can see what you picked. Opening one schema doesn't close the others: people compare schemas, and a tree that jumps around is disorienting. A filter box above the tree narrows it as you type, to matching schemas and tables, and it opens any schema with a match. Each card has a fixed height, 55 percent of the window, with a minimum, and shows a scrollbar when its content is taller. This keeps the card's size steady when you expand a schema, so a long tree never stretches the page. On a narrow window, the two cards stack instead of sitting side by side. The layout itself is deliberately plain. We first tried a header pinned to the top of a card, with the card sized to fill the window. This behaved differently from one browser to the next: a pinned header with negative margins covered the first line beneath it. The plain version uses normal block layout and one flex row, and behaves the same in every browser.

Two limits to know about on a large warehouse. Metabase commonly caps an unaggregated query result at around 2,000 rows, unless you set a limit, and we haven't verified what the data-app query hook does here. A capped result would show incomplete access, with no warning. The screen also recalculates every role's access on each render. This is fine for hundreds of tables. It would need caching for thousands.

**The rules live in two plain files.** `src/lib/access.ts` takes the direct grants and the memberships, and answers one question: can this role read this table, and through which other role? It follows memberships through other roles, and has no React code in it at all. We checked its answers against Postgres's own `has_table_privilege()`, for every person, and they matched. `src/lib/nodes.ts` describes one place in the tree, the database, a schema, or a table, and finds the tables under it.

**Four queries, each called once.** `App.tsx` runs the roles, grants, memberships, and tables queries. It builds one `model` object from the results, and hands that to every tab. A query hook shouldn't run twice for the same data, so the data lives at the top of the app, and the components below receive it as props. The grants query has its `SELECT` filter built into the declaration, because that filter never changes. A filter that does change while the app runs, such as a selected role, goes in the hook's second argument instead.

**Each screen keeps its own selection.** React holds a selection with `useState`. Changing it redraws the screen. `App.tsx` keeps every tab mounted, and only hides the inactive ones, so switching tabs never forgets what you picked.

## Queue changes, then apply them

Nothing you click changes the database right away. A click queues a change. The change only runs when you press **Apply changes**. So a mistaken click costs nothing: you can remove it from the list, discard the whole list, or just never press Apply.

**Queued changes show up on the screen straight away.** The app draws the database as it would look once the queue has run, and marks anything a queued change would alter with a dashed amber outline. Remove a person from a functional role, for example, and the grey rings they had through it disappear from the Permissions tab right away, with the dashed outline still showing, so you see the effect before you commit to it. A role that's only queued to be created shows up in the lists with a **new** badge.

**The Apply bar lives at the bottom of the window.** It appears when something is queued, and shows how many changes are waiting. Open it to read each one in plain English, for example "Give imp_pr_rl_frank read access to every table in staging," and to remove any single change. **Discard** throws the whole list away. **Apply changes** runs it.

**Squares are clickable and circles are read-only.** Square checkboxes queue a change. Circles show access that comes through another role, so you change that access on the other role instead.

**What you can queue**

- **Grant or revoke read access.** A checkbox next to a database role queues access to a table, a schema, or the whole database. On a schema it covers every table in it, and on the database it does that for each schema.
- **Add or remove a membership.** On the Database Role Mappings tab, checkboxes put a person database role into a functional database role, or take it out, from either side.
- **Add a database role.** The **Manage Database Roles** tab has an **Add database role** button at the top. It opens a dialog that asks for a kind, functional or person, and a name. The app adds the matching prefix for you, so you only type the name itself. The whole name, prefix included, can't be longer than 63 characters: Postgres silently cuts off anything longer. The dialog shows how many characters you have left, and refuses a name that's too long, that uses anything but lowercase letters, numbers, and underscores, or that already exists.
- **Delete a database role.** The same tab lists every database role, grouped by kind, with a **Delete** button on each. The button opens a dialog with a warning that says what else is affected. For a functional role, it lists the person roles that will be removed from it, and will lose the access they got through it. For a person role, it lists the functional roles it will leave. Type the role's full name to turn on the confirm button. Confirming queues the deletion, which also removes what the role could read. If a role only exists in the queue, not yet in the database, deleting it just takes its creation back out.

**Apply sends the whole list as one batch, and the database applies it all or not at all.** The app packs every queued change into one row of `command_batch`, and sends it with a single action. A database trigger runs the changes in order, inside one transaction. After each change, it checks Postgres's system catalog, to confirm the change really took effect: a grant by looking for the role's own entry on the table, a membership by looking for the pair, and a new role by looking for the role itself and, for a person role, for the connection role's ability to switch to it. If every change passes, the trigger saves the row with `status = applied`. If any change fails, or fails its check, the trigger undoes everything the batch did. The row is still saved, but with `status = failed`, the database's error message, and which change failed. Nothing is ever half applied, so the app never has to guess what happened. On success, the queue clears. On failure, the queue stays as it was, and the message says nothing was changed, so you can remove the change that failed, or fix the cause, and press Apply again.

**A failed batch isn't an error to Metabase.** The row is saved either way, so the Metabase action itself succeeds even when the batch failed. The real answer is in the row's `status`. The app reads that status from the response.

**The database keeps the record, and the app shows it two ways.** The row holds what was asked, the exact SQL the database ran, and the outcome of each change. Right after you press Apply, a panel under the tabs shows the result of that save: the SQL for each change, or, for a failed save, which changes were rolled back. This panel only appears after you press Apply, and you can dismiss it. It never shows up just from loading the page. The **Audit History** tab lists every save the database has recorded, newest first, and each row opens to show the same detail. The database keeps this record, so it survives a page reload. If a response never reaches the browser, the app notices a newer row with exactly what it sent, and reads the outcome from that row instead. A request that never reached the database leaves no row at all, which means nothing happened. The record doesn't say who made the change, because the action doesn't pass the Metabase user through to the trigger. Metabase's own action audit may record that separately.

**The screens update after Apply without a refresh.** The app never stores who can read what. It works that out in the browser, from three lists it loaded: the roles, the direct grants, and the memberships. After Apply, it reloads those three lists, and every screen that depends on them redraws. This is why removing a person from a functional role updates the Permissions tab right away.

**Queued changes can depend on each other, and the app keeps the queue valid.** A row policy needs row security turned on for its table, and a role that can read it. Both of those have to come from changes queued earlier. If you take one of them back, the app removes the dependent policy from the queue too, and tells you: "Also removed 1 queued row policy that depended on it." Without this, the database would refuse the policy, and the whole save would fail. Removing a queued role creation already removes everything else that mentions that role. Otherwise, the order of unrelated changes doesn't matter.

**The queue has one rule about undoing.** Clicking the same table or membership twice in a row cancels itself out. The list never holds a grant immediately followed by its own revoke. Schema and database changes always stay in the list: they cover many tables, and taking one back wouldn't undo the others anyway. Either way, the final result is correct, because the batch runs in order.

**The database enforces the rules, not the screen.** Only `SELECT` can be granted. Only roles starting with `imp_fn_rl_` or `imp_pr_rl_` can be created, dropped, granted to, or given members. A person role must use `imp_pr_rl_`. A functional role must use `imp_fn_rl_`. The database refuses any name over 63 characters; otherwise, Postgres would silently cut it short, and create a role with a different name than the one asked for. Creating a person role also lets the connection role switch to it, which impersonation needs. Dropping a role first revokes everything it holds, and the database refuses to drop a role that owns any database objects. A client can't fake success either: the `status`, `results`, and `error_message` columns are always set by the trigger itself, no matter what a client sends. A batch that's malformed, empty, or missing a field is recorded as failed.

**One action, declared once.** `actions/batch.action.ts` wraps the create action of the `command_batch` model. The build copies that model into the app's own Metabase collection. This lets people using the app run the action without access to the original model, which stays locked to admins. The build writes the copy's id into the file, as `copiedActionId`. Don't edit that line.

**Generate the typed schema before the first build, or expect suffixes.** Once the build has copied a model into the app's collection, regenerating the typed schema lists both the original and the copy. It renames the duplicates with their ids, for example `commandBatchModel145`. The type-checker then flags your existing code, and the fix is to use the suffixed name of the original model instead. We avoided this problem entirely, by regenerating the schema before the first build.

**Dialogs handle the keyboard on themselves.** The sandbox the app runs in blocks keyboard listeners on the whole document, so each dialog catches the Escape key on its own element instead, and focus starts inside it. Clicking the dim area around a dialog also closes it.

**What it doesn't do yet.** Tables created after a schema was granted aren't covered. We've left that for a separate project. The screen also ignores grants to `PUBLIC`, and doesn't show schema-level `USAGE`, so a database role could look like it has access to a table it actually can't reach.

## Restrict rows with row security

The **Row and Column Policies** tab uses Postgres row-level security. You turn it on for a table, then add policies that say which rows a database role can see.

**A table with row security on is locked down.** A database role that can read the table still gets no rows until a policy lets it see some. So `select *` works and returns nothing. This is the safe default for a sensitive table: turning row security on can't leak anything.

**Policies add up.** A policy says: this role sees the rows where this column is one of these values. If one policy lets a role see the US, and another lets it see Canada, the role sees both. This holds across roles too. A person sees the rows allowed by their own policies, and by the policies on every functional role they belong to. Adding a policy can only show more rows, never fewer, and the tab says so right where you add a new one. You can't restrict a role that already sees everything, not in this app: a role only ever sees rows through a policy.

**The connection role sees everything, and people don't.** `metabase_reader` has `BYPASSRLS`, so Metabase can sync and scan every row. That attribute belongs to whichever role is in effect at the time, so it doesn't carry over when Metabase switches to a person with `SET ROLE`. We checked both directly: the connection role reads all 200 demo orders, and a person sees only what their own policies allow.

**A policy needs access first.** The role dropdown lists only database roles that can read the table, directly or through a functional role, and says why the others are missing. The database refuses a policy for any other role.

**Losing access removes the policies.** Say a database role can no longer read a table, from a revoke, from leaving the functional role that granted it, or from the role itself being deleted. Either way, its policies on that table are removed too. No orphan policy stays behind. Every batch ends with a step that removes the policies of any role left without access, then checks that none are left over. This step judges the batch's final result, not each step along the way, so a batch that revokes access and then grants it back again keeps its policies. The removal is recorded as its own step in the audit history, and the Apply bar also warns you beforehand: "This also removes 2 row policies." Deleting a role removes its policies the same way. Granting the role's access back later doesn't bring the old policies back.

**Turning row security off removes the app's policies first.** You type the table name to confirm. The dialog lists what will go. Policies the app didn't create are left alone. The tab shows those as "not managed by this app," read-only, and they have no effect anyway while row security is off.

**The catalog is the record.** A policy the app creates is named `imp_rls_`, plus a hash of its role, table, column, and values, so the same rule always gets the same name. The rule is also stored as JSON, in the policy's own comment, and `v_row_policies` reads that comment back. Nothing about a policy lives in the app itself, only in Postgres. Values go into the policy as quoted literals, so a value like `O'Brien'); drop table x; --` is stored as plain text, and does nothing else.

**Only "is one of" for now.** It works on text, number, and true/false columns, with up to 200 values, entered separated by commas. A rule is a column, an operator, and values, so operators such as between and is not one of can be added later without reshaping the screen.

**The tab has two views.** _By table_ shows the tables with row security on. For the selected one, it shows its policies, and the database roles that can read it but see no rows. _By database role_ is read-only. It lists, for one role, each locked-down table it can read, and the policies that apply, marking the ones inherited from a functional role.

**Hiding columns is not built.** The tab ends with a "Column policies: coming soon" panel. Postgres can't hide one column from a role that can read the whole table, so it needs a different approach.

**Test the interactions, not just the buttons.** Roles, grants, memberships, and policies all affect each other, so the checks that matter most are the combinations, not single buttons in isolation. We ran a set of tests against a throwaway database. For each one, we compared what the app predicts for a queue against what the database actually did: revoking a table, regranting in the same batch or a later one, removing someone from a role, revoking a whole schema, deleting functional and person roles, and turning row security off. The two matched in every case. We also fed the database bad input on purpose: empty values, non-list values, unknown columns, columns of the wrong type, a role with no access, and a duplicate policy. Each one failed with a clear message, and rolled back cleanly.

**Regenerating the schema.** The tab adds three views, `v_rls_tables`, `v_row_policies`, and `v_columns`. After they synced into Metabase, regenerating the typed schema produced the duplicate model names described above, so we kept the original `commandBatchModel` block and took only the new tables.

## Who can use the app

Only admins need to use this app. Metabase lets any admin open any app, so nobody has to be added to the app's permission group, and that group can stay empty. The app's saved questions and model copy live in a Metabase-managed collection, and nobody needs direct access to it. Keep data access to the `fine_grained_access` views limited to admins too. Anyone who can read them can see who has access to what.

## Known gaps and future work

Not built, not currently planned in detail. Recorded here so they aren't lost.

**Performance at scale: thousands of tables, hundreds of roles.** Not tested at that scale, reasoned through only. `v_grants`/`v_memberships` read `pg_class.relacl` (via `aclexplode`) and `pg_auth_members`, Postgres catalogs that are indexed and cache-resident, cheap even with tens of thousands of tables. The real cost is proportional to how many `GRANT` statements actually exist, not to tables times roles, so a normal grant pattern should stay cheap regardless of table count. Two places could still hurt: the app fetches the entire `v_grants`/`v_memberships` result on every load and filters client-side, so a genuinely dense grant pattern means a large JSON payload on every screen load, not just the one being viewed; and the schema tree only skips rendering a collapsed schema's tables, so one schema with thousands of tables, expanded, renders every row with no virtualization. Mitigation ideas, cheapest first: scope the queries to the selected role or table instead of fetching everything; virtualize the expanded table list; require a filter before a very large schema auto-expands; a schema-level summary with drill-down instead of a flat list. A materialized view is the last resort, not the first. It would trade away the property the whole read side relies on: checkboxes that can never drift from the real catalog, because they never cache anything.

**More row policy operators.** Today's row policies only support "is one of" (an equality-or-membership list) on text, number, and boolean columns. `between`, `is not one of`, and similar were named as likely follow-ups when the feature was designed (see "Only 'is one of' for now" above). The database function (`apply_row_policy_create`) and the policy's stored shape (`{column, op, values}`, currently always `op: "in"`) were deliberately built to add an operator without reshaping either one. A new operator needs a new `op` value, a new SQL comparison branch, and a matching UI control in `AddPolicyModal`, not a redesign.

**AND between conditions, not just OR.** Every policy the app creates today is permissive, so two policies on the same role always OR together (confirmed live: a role with a country policy and a segment policy sees rows that match either one, not both). Postgres also supports restrictive policies, which narrow whatever the permissive ones already allow, giving a real AND. Not built: no way to mark a policy restrictive, and no way to combine two conditions in one policy's own expression either.

**A table added to a schema after a role was granted the whole schema.** `grant select on all tables in schema X` only covers the tables that exist at the moment it runs; Postgres does not retroactively include a table created afterward (that needs `ALTER DEFAULT PRIVILEGES`, which this app doesn't set up). So a role with "all of staging" does not automatically gain a newly added table, it has to be re-granted. Worth fixing properly: either wire `ALTER DEFAULT PRIVILEGES` when a whole-schema grant runs, or make the gap visible instead of silent.

**A table is deleted.** Expected to be a no-op for the app: Postgres drops whatever ACL entries referenced the table along with it, and every read view already reads `pg_class` live, so a deleted table just stops appearing. Not actually verified end to end, in particular whether a row policy or a queued change referencing a since-deleted table fails cleanly.

**Column filtering / hiding.** The "Column policies: coming soon" panel is a placeholder only. Unlike row policies, this isn't the same mechanism reused. Postgres can't hide a single column from a role that holds table-level SELECT (a column-level `REVOKE` doesn't take effect while table SELECT is held, and `select *` errors on a genuinely hidden column rather than silently omitting it). Needs a different approach entirely, most likely a generated view per policy that exposes only the allowed columns, rather than a Postgres privilege.
