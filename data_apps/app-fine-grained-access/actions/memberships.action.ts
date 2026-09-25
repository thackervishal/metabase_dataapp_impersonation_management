import { defineAction } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

// Inserts a row into command_membership; a database trigger turns it into a real
// GRANT role TO role, or REVOKE.
export const CreateMembership = defineAction({
    action: schema.models.commandMembershipModel.actions.create,
    copiedActionId: 14
});
