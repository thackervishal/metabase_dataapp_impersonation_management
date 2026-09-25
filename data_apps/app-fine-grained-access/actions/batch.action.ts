import { defineAction } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

// Inserts one row into command_batch holding every queued change. A database trigger applies
// them in one transaction, checks each one in the system catalog, and writes the outcome back
// into the row: status "applied" (all of it happened) or "failed" (none of it did).
export const CreateBatch = defineAction({
    action: schema.models.commandBatchModel.actions.create,
    copiedActionId: 17
});
