import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const roles = schema.tables.vRoles;

// Every role the app manages (people and functional roles), sorted by name.
export const Roles = defineQuery({
    source: roles,
    orderBys: [orderBy(roles.fields.roleName, "asc")],
    savedQuestionSourceId: 139
});
