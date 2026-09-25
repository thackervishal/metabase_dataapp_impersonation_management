import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const tree = schema.tables.vSchemaTree;

// Every schema and table the app can grant access to.
export const SchemaTree = defineQuery({
    source: tree,
    orderBys: [
        orderBy(tree.fields.schemaName, "asc"),
        orderBy(tree.fields.tableName, "asc"),
    ],
    savedQuestionSourceId: 140
});
