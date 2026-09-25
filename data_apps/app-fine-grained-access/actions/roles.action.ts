import { defineAction } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

// Inserts a row into command_role; a database trigger creates or drops the role.
// The action value says which: create_person, create_functional, or drop.
export const CreateRoleCommand = defineAction({
    action: schema.models.commandRoleModel.actions.create,
    copiedActionId: 15
});
