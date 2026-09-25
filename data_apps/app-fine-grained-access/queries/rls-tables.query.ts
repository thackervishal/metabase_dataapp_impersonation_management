import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const rlsTables = schema.tables.vRlsTables;

// Every table that has row security turned on.
export const RlsTables = defineQuery({
    source: rlsTables,
    orderBys: [
        orderBy(rlsTables.fields.schemaName, "asc"),
        orderBy(rlsTables.fields.tableName, "asc"),
    ],
    savedQuestionSourceId: 150
});
