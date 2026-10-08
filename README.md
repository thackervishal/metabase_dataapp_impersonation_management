# Metabase Fine Grained Access -- Data App

---

<table>
  <tr>
    <td width="200">
      <a href="https://youtu.be/j3FduAEqTeQ"><img src="https://img.youtube.com/vi/j3FduAEqTeQ/maxresdefault.jpg" width="200" alt="Watch the demo video"></a>
    </td>
    <td valign="middle">
      <h3><a href="https://youtu.be/j3FduAEqTeQ">▶ Watch the demo video</a></h3>
      Opens on YouTube.
    </td>
  </tr>
</table>

---

A local Metabase stack with a Postgres warehouse, using Metabase [connection impersonation](https://www.metabase.com/docs/latest/permissions/impersonation) to handle fine grained access for users.

Layered on top is a Metabase data app that provides a gui to manage all of the database artifacts needed for impersonation access on that warehouse: database roles, who has one, what each role can read, which rows a role sees, and a log of every change.

For impersonation in action in other databases (this is repo is postgres), with different people seeing different rows of the same dashboard, see the [MySQL](https://github.com/thackervishal/metabase_demo_mysql_rls) or [SQL Server](https://github.com/thackervishal/metabase_demo_sqlserver_rls) RLS demo.

---

## Prerequisites

- Docker Desktop
- Git
- Node.js 20.6 or later
- A Metabase Enterprise license token, with the data apps entitlement

## Quick start

Clone the repo and copy the example environment file:

```bash
git clone https://github.com/thackervishal/metabase_dataapp_impersonation_management.git
cd metabase_dataapp_impersonation_management
cp .env.example .env
```

Open `.env` and set `MB_PREMIUM_EMBEDDING_TOKEN`. Git ignores this file. This is the only value you need to change. Every other value in `.env.example` already works.

Start the stack, then set up the app:

```bash
docker compose up -d
node scripts/setup-app.mjs
```

The first command starts Metabase and the warehouse, and seeds demo data. Give it a minute. The second command sets up the app: it turns on model actions, creates a locked-down collection, builds the app, and imports it into Metabase. It also takes about a minute. It is safe to run again. If the app is already set up, it says so and stops.

Open <http://localhost:3000> and sign in as admin. See [Admin credentials](#admin-credentials). Find Fine Grained Access in the sidebar.

## Try it

The warehouse ships with three functional roles and some demo people, already set up:

| Functional role     | Can read                              |
| ------------------- | ------------------------------------- |
| `imp_fn_rl_sales`   | Sales tables, two row policies        |
| `imp_fn_rl_finance` | Finance tables, one table has no rows |
| `imp_fn_rl_hr`      | HR tables, two row policies           |

A few things to try, in order:

1. **Manage Database Roles.** Add a new functional role, for example `marketing`. Nothing happens in the database yet. The **Apply changes** bar at the bottom shows what is queued.
2. **Database Role Mappings.** Add a person to your new role.
3. **Permissions.** Pick your new role, then grant it a table. Press **Apply changes**. Now the database runs the grant, and the screen refreshes.
4. **Row and Column Policies.** Turn on row security for a table your role can read. Add a policy, for example "only rows where `region` is `East`." Apply it.
5. **Audit History.** Open the batch you just applied. It shows the exact SQL the database ran, in order.

## Log in as someone else

Three people, the same names as the MySQL and SQL Server RLS demos, can also sign in to Metabase itself and run real questions. Metabase impersonates each one as a Postgres person role, and Postgres filters the rows from there:

| Person        | Login             | Sees                                                                                                  |
| ------------- | ----------------- | ----------------------------------------------------------------------------------------------------- |
| Bruce Wayne   | bruce@example.com | 121 of 200 sales orders: sales, plus a row policy just for Bruce                                      |
| Thor Odinson  | thor@example.com  | 48 of 60 HR records: HR, plus a row policy just for Thor                                              |
| Frodo Baggins | frodo@example.com | 107 of 200 sales orders, from sales and finance alone; 0 of 40 budget rows, access with no row policy |

All three use the password `metabot1`. The **RLS Demo** dashboard has four cards already set up for this. Log in as each person and open it, with no setup needed.

The first card reads straight from Postgres: `current_user` for the database role Metabase impersonated you as, and the functional roles that role belongs to. Metabase's own top corner already shows which person is logged in, so this card is the other half: who that person actually is in the database.

The two counts show a table-level change: grant or revoke a role's access to a table in the app, refresh, and a card goes from a number to a permission error, or back.

The map shows a row-level change instead, on the same column one of the sales row policies already filters: `country_name`. Policies add up, so the map isn't just the two countries that policy names. Rows also show through if they match a different policy on the same role, such as the "Enterprise" customer segment, or, for Bruce, his own personal policy. Edit a policy's values in the app, refresh the map, and the set of countries on it changes, even though the role's table access never did.

## Admin credentials

| Service   | URL or host                     | User              | Password   |
| --------- | ------------------------------- | ----------------- | ---------- |
| Metabase  | <http://localhost:3000>         | admin@example.com | `metabot1` |
| Warehouse | localhost:5433, db `sample_dwh` | `postgres`        | `metabot1` |

---

## How it works

Metabase connects to the warehouse as one shared role, `metabase_reader`. When a real Metabase user opens a question, Metabase runs `SET ROLE <their role>` first. From that point, Postgres only returns the rows and tables that role can see. This is connection impersonation. Postgres enforces access, not Metabase.

Every database role has a prefix. `imp_fn_rl_*` for a functional role, such as sales or finance. `imp_pr_rl_*` for a person. A person can belong to more than one functional role, and inherits what each one can read.

You never write SQL in the app. Here is what happens when you press **Apply**:

1. The app calls one Metabase action: a plain "create" action on a model built over a table called `command_batch`.
2. That action inserts one row into `command_batch`, with your queued changes as JSON.
3. A trigger on `command_batch` fires before the insert. It reads the JSON and does the real work: it runs the matching `GRANT`, `REVOKE`, `CREATE ROLE`, or row policy SQL, all inside one transaction.
4. The trigger writes the result into that same row: applied or failed, with the exact SQL it ran.
5. The app reads the row back and shows you the result. The Audit History tab lists every row like this, so it can't drift from what the database actually did.

Row-level security uses Postgres policies. Turning on row security for a table blocks every role from it until a policy lets rows back in. A policy says "this role sees rows where this column is one of these values." Policies on the same role add up: they only ever add rows, never take rows away.

Metabase pulls a data app from a connected git repository; you don't upload one. `scripts/setup-app.mjs` builds the app, pushes it to a small local git repository under `data/remote-sync`, and points Metabase's remote sync at that local repository. You don't need a GitHub account for this demo.

For the full design, see [DATA_APPS_101.md](DATA_APPS_101.md).

---

## Build the app

The app's source is in `data_apps/app-fine-grained-access/`. Work on it like any other npm project:

```bash
cd data_apps/app-fine-grained-access
npm install
npm run dev
```

This serves a live preview at <http://localhost:5174>, inside the same sandbox Metabase uses to run the app in production. The dev server reads the same `.env` at the repo root, so there is nothing else to set up.

To rebuild and push your changes into Metabase:

```bash
npm run build
node ../../scripts/setup-app.mjs
```

[DATA_APPS_101.md](DATA_APPS_101.md) is a guide to the app, written for someone new to Metabase data apps. It goes file by file, and explains the generated typed schema the build depends on.

---

## Where things are

- Metabase: <http://localhost:3000>. The image tag is `MB_IMAGE_TAG` in `.env`, `v1.64.x` by default.
- Warehouse: `psql -h localhost -p 5433 -U postgres sample_dwh`.
- App source: `data_apps/app-fine-grained-access/`.
- Setup script: `scripts/setup-app.mjs`.
- Guide for people new to data apps, with the design and the known gaps: [DATA_APPS_101.md](DATA_APPS_101.md).

## Stop or reset

```bash
docker compose stop     # pause, keep the data
docker compose down -v  # wipe everything and start fresh
```
