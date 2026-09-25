import { tableKey } from "./access";
import type { Access, Mappings, NodeAccess, Role } from "./access";
import type { Change, RoleKind } from "./changes";

// A place in the tree: the whole database, one schema, or one table.
export type Node =
  | { level: "database" }
  | { level: "schema"; schema: string }
  | { level: "table"; schema: string; table: string };

// The controls for changing things. Nothing runs when you click: changes are queued
// (pending) and only run when you press Apply.
export type Editing = {
  busy: boolean; // the queue is running
  pending: Change[]; // queued changes, in order
  // Queue a change.
  stageGrant: (role: string, node: Node, grant: boolean) => void;
  stageMembership: (member: string, role: string, add: boolean) => void;
  stageCreateRole: (name: string, kind: RoleKind) => void; // name without the prefix
  stageDeleteRole: (role: string) => void;
  removePending: (index: number) => void;
  discard: () => void; // throw the whole queue away
  apply: () => void; // run the queue
};

// Everything the screens need, built once in App.tsx and passed down.
// `access`, `mappings`, and `roles` describe the database as it would be once the queued
// changes have run. `saved` describes it as it is now, so a screen can mark what differs.
export type Model = {
  databaseName: string;
  tables: Record<string, string[]>; // schema -> table names
  roles: Role[];
  access: Access;
  mappings: Mappings;
  saved: { access: Access; mappings: Mappings };
  editing: Editing;
};

export const DATABASE_NODE: Node = { level: "database" };

export function sameNode(a: Node, b: Node): boolean {
  if (a.level !== b.level) {
    return false;
  }
  if (a.level === "database" || b.level === "database") {
    return true;
  }
  if (a.level === "schema" || b.level === "schema") {
    return a.level === "schema" && b.level === "schema" && a.schema === b.schema;
  }
  return a.schema === b.schema && a.table === b.table;
}

export function nodeTitle(node: Node, model: Model): string {
  if (node.level === "database") {
    return model.databaseName;
  }
  return node.level === "schema" ? node.schema : `${node.schema}.${node.table}`;
}

// The tables a node covers, as "schema.table" keys.
function tableKeysUnder(node: Node, model: Model): string[] {
  const schemas =
    node.level === "database" ? Object.keys(model.tables) : [node.schema];
  return schemas.flatMap((schema) =>
    (model.tables[schema] ?? []).map((table) => tableKey(schema, table)),
  );
}

// What a role can read at a node. "projected" (the default) includes queued changes;
// "saved" is what's true in the database right now.
export function accessAt(
  role: string,
  node: Node,
  model: Model,
  source: "projected" | "saved" = "projected",
): NodeAccess {
  const access = source === "saved" ? model.saved.access : model.access;
  if (node.level === "table") {
    return access.tableNodeAccess(role, tableKey(node.schema, node.table));
  }
  return access.groupAccess(role, tableKeysUnder(node, model));
}
