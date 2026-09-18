#!/bin/bash
# Creates the least-privilege role Metabase's own DB connection uses.
# It only ever gets SELECT on the read views/reporting tables and INSERT on
# the 4 command tables -- it never gets CREATEROLE or GRANT ability itself;
# that stays confined to the SECURITY DEFINER trigger functions.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username postgres --dbname "$POSTGRES_DB" \
  -v role_password="$SAMPLE_DWH_METABASE_ROLE_PASSWORD" <<-'EOSQL'
  create role metabase_reader login password :'role_password';

  grant usage on schema analytics, sales, rbac_control to metabase_reader;
  grant select on all tables in schema analytics, sales to metabase_reader;
  grant select on rbac_control.v_schema_tree, rbac_control.v_roles,
    rbac_control.v_grants, rbac_control.v_memberships to metabase_reader;

  grant insert on rbac_control.role_commands, rbac_control.user_commands,
    rbac_control.grant_commands, rbac_control.membership_commands to metabase_reader;
  grant usage on all sequences in schema rbac_control to metabase_reader;
EOSQL
