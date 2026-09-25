// Changes people ask for are queued here, and only run when they press Apply.
// Everything in this file is plain functions: no React, no queries.

import { tableKey } from "./access";
import type { Grant, Membership, Role } from "./access";
import type { Node } from "./nodes";

export type RoleKind = "functional" | "person";

export type Change =
  | { kind: "grant"; role: string; node: Node; grant: boolean }
  | { kind: "membership"; member: string; role: string; add: boolean }
  | { kind: "createRole"; role: string; roleKind: RoleKind }
  | { kind: "dropRole"; role: string };

// What the app has loaded from the database.
export type State = {
  roles: Role[];
  grants: Grant[];
  memberships: Membership[];
};

type TableRef = { schema: string; table: string };

// The tables a node covers.
export function tablesUnder(
  node: Node,
  tables: Record<string, string[]>,
): TableRef[] {
  if (node.level === "table") {
    return [{ schema: node.schema, table: node.table }];
  }
  const schemas = node.level === "database" ? Object.keys(tables) : [node.schema];
  return schemas.flatMap((schema) =>
    (tables[schema] ?? []).map((table) => ({ schema, table })),
  );
}

function describeNode(node: Node, databaseName: string): string {
  if (node.level === "table") {
    return `${node.schema}.${node.table}`;
  }
  return node.level === "schema"
    ? `every table in ${node.schema}`
    : `every table in ${databaseName}`;
}

// One line of plain English for the list of pending changes.
export function describeChange(change: Change, databaseName: string): string {
  switch (change.kind) {
    case "grant": {
      const target = describeNode(change.node, databaseName);
      return change.grant
        ? `Give ${change.role} read access to ${target}`
        : `Take read access to ${target} away from ${change.role}`;
    }
    case "membership":
      return change.add
        ? `Add ${change.member} to ${change.role}`
        : `Remove ${change.member} from ${change.role}`;
    case "createRole":
      return `Create the ${change.roleKind} database role ${change.role}`;
    case "dropRole":
      return `Delete the database role ${change.role}`;
  }
}

// Does the second change undo the first? Only single tables and memberships count.
// Schema and database changes always stay in the list, because they cover many tables
// and the changes before them may not all be undone by taking one back.
function undoes(first: Change, second: Change): boolean {
  if (first.kind === "grant" && second.kind === "grant") {
    return (
      first.node.level === "table" &&
      second.node.level === "table" &&
      first.role === second.role &&
      first.node.schema === second.node.schema &&
      first.node.table === second.node.table &&
      first.grant !== second.grant
    );
  }
  if (first.kind === "membership" && second.kind === "membership") {
    return (
      first.member === second.member &&
      first.role === second.role &&
      first.add !== second.add
    );
  }
  return false;
}

// Add a change to the end of the list. Clicking the same checkbox twice in a row
// cancels itself out instead of queuing a grant and a revoke.
export function addChange(queue: Change[], change: Change): Change[] {
  const last = queue[queue.length - 1];
  if (last && undoes(last, change)) {
    return queue.slice(0, -1);
  }
  return [...queue, change];
}

function mentions(change: Change, role: string): boolean {
  switch (change.kind) {
    case "grant":
    case "dropRole":
      return change.role === role;
    case "membership":
      return change.member === role || change.role === role;
    case "createRole":
      return change.role === role;
  }
}

// Take one change out of the list. Removing a role's creation also removes the changes
// that mention it, because they'd fail without the role.
export function removeChange(queue: Change[], index: number): Change[] {
  const removed = queue[index];
  const rest = queue.filter((_, position) => position !== index);
  if (!removed || removed.kind !== "createRole") {
    return rest;
  }
  return rest.filter((change) => !mentions(change, removed.role));
}

// What the database would look like once every queued change has run.
// The screens draw this, so a click shows its effect straight away, marked as pending,
// including access that comes through a role.
export function applyChanges(
  base: State,
  changes: Change[],
  tables: Record<string, string[]>,
): State {
  let roles = [...base.roles];
  let grants = [...base.grants];
  let memberships = [...base.memberships];

  for (const change of changes) {
    if (change.kind === "grant") {
      const targets = tablesUnder(change.node, tables);
      const keys = new Set(targets.map((t) => tableKey(t.schema, t.table)));
      if (change.grant) {
        const held = new Set(
          grants
            .filter((g) => g.role === change.role)
            .map((g) => tableKey(g.schema, g.table)),
        );
        for (const target of targets) {
          if (!held.has(tableKey(target.schema, target.table))) {
            grants.push({ role: change.role, ...target });
          }
        }
      } else {
        grants = grants.filter(
          (g) =>
            !(g.role === change.role && keys.has(tableKey(g.schema, g.table))),
        );
      }
    } else if (change.kind === "membership") {
      const exists = memberships.some(
        (m) => m.member === change.member && m.role === change.role,
      );
      if (change.add && !exists) {
        memberships.push({ member: change.member, role: change.role });
      } else if (!change.add) {
        memberships = memberships.filter(
          (m) => !(m.member === change.member && m.role === change.role),
        );
      }
    } else if (change.kind === "createRole") {
      roles.push({ name: change.role, kind: change.roleKind, pending: true });
    } else {
      roles = roles.filter((role) => role.name !== change.role);
      grants = grants.filter((g) => g.role !== change.role);
      memberships = memberships.filter(
        (m) => m.member !== change.role && m.role !== change.role,
      );
    }
  }

  roles.sort((a, b) => a.name.localeCompare(b.name));
  return { roles, grants, memberships };
}
