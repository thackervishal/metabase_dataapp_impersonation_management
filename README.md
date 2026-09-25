# Metabase Data App: Impersonation / RBAC Management

A single-purpose repo: a small local stack (Metabase EE + Postgres warehouse with an `fine_grained_access`
schema) **and** the data app that manages the warehouse's Postgres roles and grants.
See [PLAN.md](PLAN.md) for the full design and current status, and [DATA_APPS_101.md](DATA_APPS_101.md) for a file-by-file guide aimed at people new to data apps.

## Quick start

```bash
cp .env.example .env   # fill in real passwords + your Metabase token
docker compose up -d
docker compose ps
```

Metabase: <http://localhost:3000> (admin login from `.env`); image is `MB_IMAGE_TAG` (default `v1.64.x`)
Sample warehouse: `psql -h localhost -p ${SAMPLE_DWH_PORT:-5433} -U postgres sample_dwh`

Data app source lives in `data_apps/<slug>/`; Metabase pulls it from this repo's GitHub remote (see PLAN.md, Part B).
