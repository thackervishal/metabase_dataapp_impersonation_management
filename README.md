# Metabase Data App: Impersonation / RBAC Management

See [PLAN.md](PLAN.md) for the full design and current status.

## Quick start

```bash
cp .env.example .env   # fill in real passwords + your Metabase token
docker compose build metabase   # builds from the local `../metabase` source checkout (slow the first time)
docker compose up -d
docker compose ps
```

Metabase: http://localhost:3000 (admin login from `.env`)
Sample warehouse: `psql -h localhost -p ${SAMPLE_DWH_PORT:-5433} -U postgres sample_dwh`
