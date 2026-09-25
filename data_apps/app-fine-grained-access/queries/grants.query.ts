import {
  defineQuery,
  filter,
  orderBy,
} from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const grants = schema.tables.vGrants;

// Direct SELECT grants on tables, for every role. The screen manages SELECT only,
// so the filter is part of the declaration.
export const Grants = defineQuery({
    source: grants,
    filters: [filter(grants.fields.privilege, "=", "SELECT")],
    orderBys: [
        orderBy(grants.fields.schemaName, "asc"),
        orderBy(grants.fields.tableName, "asc"),
        orderBy(grants.fields.roleName, "asc"),
    ],
    savedQuestionSourceId: 137
});
