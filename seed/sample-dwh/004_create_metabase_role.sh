#!/bin/bash
# Creates the least-privilege role Metabase's own DB connection uses.
# It only ever gets SELECT on the read views/reporting tables and INSERT on
# the 4 command tables -- it never gets CREATEROLE or GRANT ability itself;
# that stays confined to the SECURITY DEFINER trigger functions.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username postgres --dbname "$POSTGRES_DB" \
  -v role_password="$SAMPLE_DWH_METABASE_ROLE_PASSWORD" <<-'EOSQL'
  create role metabase_reader login password :'role_password';

  grant usage on schema public, staging, analytics, fine_grained_access to metabase_reader;
  grant select on all tables in schema public, staging, analytics to metabase_reader;
  grant select on fine_grained_access.v_schema_tree, fine_grained_access.v_roles,
    fine_grained_access.v_grants, fine_grained_access.v_memberships to metabase_reader;

  -- SELECT is needed too: Metabase only syncs (and builds models over) tables its user can read.
  grant select, insert on fine_grained_access.command_role,
    fine_grained_access.command_grant, fine_grained_access.command_membership to metabase_reader;
  grant usage on all sequences in schema fine_grained_access to metabase_reader;
EOSQL
