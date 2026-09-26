# Metabase Data App: Impersonation / RBAC Management

A local Metabase stack, a Postgres warehouse with a `fine_grained_access` schema, and the data app that manages the warehouse's database roles, table access, and row policies.

## Set up on a new machine

You need Docker, Git, and Node 20.6 or later.

```bash
git clone https://github.com/thackervishal/metabase_dataapp_impersonation_management.git
cd metabase_dataapp_impersonation_management
cp .env.example .env
```

Open `.env` and set `MB_PREMIUM_EMBEDDING_TOKEN` to your Metabase license token. It needs the data apps entitlement. It's the only value you have to change. Everything else in `.env.example` is a working local default.

```bash
docker compose up -d
node scripts/setup-app.mjs
```

Then open <http://localhost:3000/apps/app-fine-grained-access> and sign in with `admin@example.com` and `metabot1`.

The first command starts Metabase and builds the demo warehouse. Give it a minute or two. The second command sets up the app. Once Metabase is up it:

1. turns on model actions for the warehouse connection;
2. creates a `FineGrainedAccess` collection that only administrators can use, with a model over the `command_batch` table and its create action (the app writes through this);
3. builds the app against your Metabase, in a copy under `data/build`, so your source files stay as they are;
4. saves the built app to a local git repo in `data/remote-sync`, and imports it into Metabase through remote sync.

It takes about a minute and is safe to run again. If the app is already set up, it says so and stops. You don't need a GitHub account or token.

Only administrators can open the app, and the same login works for the rest of Metabase.

### If you use your own remote sync

If Metabase's remote sync already points at a repo of yours, the script stops without changing it. Pull the app through your own repo instead.

## Working on the app

Run `npm run dev` from `data_apps/app-fine-grained-access` for a local preview at <http://localhost:5174>. The build tools read the same `.env`, so there is nothing else to configure. [DATA_APPS_101.md](DATA_APPS_101.md) walks through the app file by file and explains the ids and typed schema the build depends on.

## Where things are

- Metabase: <http://localhost:3000>. The image is `MB_IMAGE_TAG` in `.env` (default `v1.64.x`).
- Sample warehouse: `psql -h localhost -p 5433 -U postgres sample_dwh`.
- [PLAN.md](PLAN.md) has the design and the running status log.
- [DATA_APPS_101.md](DATA_APPS_101.md) is a guide for people new to data apps, with a file-by-file tour.
- The app's source is in `data_apps/app-fine-grained-access/`, and the setup script is `scripts/setup-app.mjs`.
