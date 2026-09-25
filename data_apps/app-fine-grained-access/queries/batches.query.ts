import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const batches = schema.tables.vBatches;

// The most recent saves, newest first, with what the database recorded for each. The first
// row is the latest save; the audit tab lists them all.
export const Batches = defineQuery({
    source: batches,
    orderBys: [orderBy(batches.fields.batchId, "desc")],
    limit: 100,
    savedQuestionSourceId: 148
});
