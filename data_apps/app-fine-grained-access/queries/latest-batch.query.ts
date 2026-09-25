import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const batches = schema.tables.vBatches;

// The most recent save, with what the database recorded for it. Read on every load, so the
// outcome of a save is still there after a page reload.
export const LatestBatch = defineQuery({
    source: batches,
    orderBys: [orderBy(batches.fields.batchId, "desc")],
    limit: 1,
    savedQuestionSourceId: 146
});
