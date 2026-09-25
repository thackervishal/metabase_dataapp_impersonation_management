import { defineAction } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

// Inserts a row into command_grant; a database trigger turns it into a real GRANT or REVOKE.
export const CreateGrant = defineAction({
    action: schema.models.commandGrantModel.actions.create,
    copiedActionId: 13
});
