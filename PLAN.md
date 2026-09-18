# Build Plan: RBAC Data App on Metabase

## What this is

A tool for managing Postgres roles, users, and table grants — built as an actual Metabase "data app" (the new, not-yet-released feature: a small React app that lives inside Metabase). Reads (schema tree, roles, current grants) come from plain SQL views. Writes (create role, grant, etc.) go through small "command" tables — Metabase's own actions can only insert plain values, not build DDL, so each command table has a database trigger that turns the inserted row into the real `CREATE ROLE` / `GRANT` / etc.

## Split of work

- **Claude builds and seeds the docker stack end-to-end**: Postgres + Metabase running locally, sample data loaded, the RBAC tables/triggers in place.
- **The data app itself is done together** — as a walkthrough (remote sync setup, scaffolding, seeding, wiring up the UI), explaining what's happening at each step, rather than built unattended.

## Part A — Docker stack

- `app-db`: Postgres, Metabase's own metadata.
- `sample-dwh`: Postgres, seeded on first boot with:
  - `analytics` and `sales` schemas — a few small tables with sample rows, so there's something real to report on.
  - `rbac_control` schema:
    - **read views** — `v_schema_tree`, `v_roles`, `v_grants`, `v_memberships` (plain SELECTs over Postgres's own catalogs).
    - **command tables** — `role_commands`, `user_commands`, `grant_commands`, `membership_commands`. Each has a trigger that runs the real DDL when a row is inserted (e.g. inserting into `grant_commands` triggers a `GRANT`/`REVOKE`). Only this trigger's owner role needs elevated Postgres privileges — Metabase's own connection just needs `SELECT` on the views and `INSERT` on these 4 tables.
- `metabase`: **built from the local metabase source checkout**, since data apps aren't in any published release yet — confirmed the newest public tag (`v1.63.2.7`) predates the data-app commits on master.

Verification before moving to Part B: bring the stack up, confirm the seed data and views/tables exist, and confirm inserting test rows into the command tables actually produces the right `GRANT`/`CREATE ROLE`/etc. via plain `psql` — before Metabase or the data app touch any of it.

## Part B — Data app (walkthrough)

Rough shape of what a developer does, walked through step by step when we get there:
1. Connect a git repo to Metabase via Admin → Settings → Remote sync (data apps are delivered by git push, not upload).
2. Scaffold a new app under `data_apps/<name>/` using Metabase's own scaffold template.
3. Point the DB connection's sync at `sample_dwh`, mark the 4 command tables as "Models" so Metabase generates actions for them.
4. Generate the app's typed schema (a TypeScript file describing the tables/actions it can use).
5. Build the actual screens: a schema tree + role/grant checkboxes, and simple forms for role/user/membership management — reading via Metabase's data hooks, writing via its action hooks.
6. Commit, push, pull the sync into Metabase, and try it at `/apps/<name>`.

## Open item

`:data-apps-preview` is gated by the Metabase license token in use. First thing to check once the stack is up: does the existing token actually unlock it. If not, this blocks on getting an entitled token before Part B can go anywhere.

## Status log

- 2026-08-03: Plan approved. Starting Part A (docker stack).
