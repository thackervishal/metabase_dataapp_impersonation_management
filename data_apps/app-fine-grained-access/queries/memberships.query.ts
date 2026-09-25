import { defineQuery, orderBy } from "@metabase/embedding-sdk-react/data-app";

import schema from "../src/metabase.data";

const memberships = schema.tables.vMemberships;

// Which role is a member of which (people in functional roles, and so on).
export const Memberships = defineQuery({
    source: memberships,
    orderBys: [
        orderBy(memberships.fields.memberName, "asc"),
        orderBy(memberships.fields.roleName, "asc"),
    ],
    savedQuestionSourceId: 138
});
