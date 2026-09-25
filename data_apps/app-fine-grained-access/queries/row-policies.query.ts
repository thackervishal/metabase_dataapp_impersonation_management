import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const policies = schema.tables.vRowPolicies;

// Every row policy, one row per policy and role. The ones this app didn't create are
// included so the screen can show them, read-only.
export const RowPolicies = defineQuery({
    source: policies,
    orderBys: [
        orderBy(policies.fields.schemaName, "asc"),
        orderBy(policies.fields.tableName, "asc"),
        orderBy(policies.fields.roleName, "asc"),
        orderBy(policies.fields.policyName, "asc"),
    ],
    savedQuestionSourceId: 151
});
