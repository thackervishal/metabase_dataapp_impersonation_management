import {
  defineQuery,
  filter,
  orderBy,
} from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const columns = schema.tables.vColumns;

// The columns a row policy can filter on: text, number, and boolean columns.
export const Columns = defineQuery({
    source: columns,
    filters: [filter(columns.fields.typeKind, "!=", "other")],
    orderBys: [
        orderBy(columns.fields.schemaName, "asc"),
        orderBy(columns.fields.tableName, "asc"),
        orderBy(columns.fields.ordinal, "asc"),
    ],
    savedQuestionSourceId: 149
});
