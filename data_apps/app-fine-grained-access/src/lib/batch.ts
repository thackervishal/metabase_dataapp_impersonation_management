// The batch: everything queued, sent to the database as one row, applied in one transaction.
// These are plain functions for building what's sent and reading what comes back.

import type { Change, RoleKind } from "./changes";
import { describeValues, toWireValues } from "./policies";

// One change as the database function reads it. Tables are named one by one, or "*" for every
// table in a schema, so a database-wide change becomes one entry per schema.
export type WireChange =
  | { kind: "grant"; role: string; schema: string; table: string; grant: boolean }
  | { kind: "membership"; member: string; role: string; add: boolean }
  | { kind: "createRole"; role: string; roleKind: RoleKind }
  | { kind: "dropRole"; role: string }
  | { kind: "enableRls"; schema: string; table: string }
  | { kind: "disableRls"; schema: string; table: string }
  | {
      kind: "createRowPolicy";
      role: string;
      schema: string;
      table: string;
      column: string;
      values: (string | number | boolean)[];
    }
  | { kind: "dropRowPolicy"; schema: string; table: string; policy: string }
  // Recorded by the database itself at the end of a save, never sent by the app.
  | { kind: "pruneOrphanPolicies" };

export function toWire(
  change: Change,
  tables: Record<string, string[]>,
): WireChange[] {
  if (change.kind === "createRowPolicy") {
    const { role, schema, table, column } = change;
    return [
      {
        kind: "createRowPolicy",
        role,
        schema,
        table,
        column,
        values: toWireValues(change.values, change.columnKind),
      },
    ];
  }
  if (change.kind === "dropRowPolicy") {
    return [
      { kind: "dropRowPolicy", schema: change.schema, table: change.table, policy: change.policy },
    ];
  }
  if (change.kind !== "grant") {
    return [change];
  }
  const { node, role, grant } = change;
  if (node.level === "table") {
    return [{ kind: "grant", role, schema: node.schema, table: node.table, grant }];
  }
  const schemas = node.level === "schema" ? [node.schema] : Object.keys(tables);
  return schemas.map((schema) => ({ kind: "grant", role, schema, table: "*", grant }));
}

// A row policy a change removed, as the database recorded it before it went.
export type RemovedPolicy = {
  policy: string;
  role: string;
  schema: string;
  table: string;
  column: string;
  values: string[];
};

// What the database recorded for one change in a batch.
export type Outcome = {
  index: number;
  change: WireChange | null;
  status: "applied" | "rolled_back" | "failed";
  sql: string[];
  error: string | null;
  // Saves made before this was recorded have none, even if they removed policies.
  removedPolicies: RemovedPolicy[];
};

export type BatchRecord = {
  id: number;
  requestedAt: string;
  status: string; // "applied" or "failed"
  errorMessage: string | null;
  changes: string; // exactly what was sent
  results: string; // what the database recorded, as JSON text; read with parseOutcomes
};

// How many changes were in a batch. A value that can't be read counts as zero.
export function countChanges(changes: string): number {
  try {
    const parsed: unknown = JSON.parse(changes);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

// Turn the text the database stored into outcomes. It always writes valid JSON, but a
// bad value should show as "no details" and not break the screen.
export function parseOutcomes(text: unknown): Outcome[] {
  try {
    const parsed: unknown = JSON.parse(String(text));
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map((item: Record<string, unknown>) => ({
      index: Number(item.index),
      change: (item.change as WireChange | undefined) ?? null,
      status: item.status as Outcome["status"],
      sql: Array.isArray(item.sql) ? item.sql.map(String) : [],
      error: item.error ? String(item.error) : null,
      removedPolicies: Array.isArray(item.removedPolicies)
        ? item.removedPolicies.map((p: Record<string, unknown>) => ({
            policy: String(p.policy),
            role: String(p.role),
            schema: String(p.schema),
            table: String(p.table),
            column: String(p.column ?? ""),
            values: Array.isArray(p.values) ? p.values.map(String) : [],
          }))
        : [],
    }));
  } catch {
    return [];
  }
}

export function describeWire(change: WireChange | null): string {
  if (!change) {
    return "Unknown change";
  }
  switch (change.kind) {
    case "grant": {
      const target =
        change.table === "*"
          ? `every table in ${change.schema}`
          : `${change.schema}.${change.table}`;
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
    case "enableRls":
      return `Turn on row security for ${change.schema}.${change.table}`;
    case "disableRls":
      return `Turn off row security for ${change.schema}.${change.table} and remove its row policies`;
    case "createRowPolicy":
      return `Let ${change.role} see rows of ${change.schema}.${change.table} where ${change.column} is one of: ${describeValues(change.values.map(String))}`;
    case "dropRowPolicy":
      return `Remove row policy ${change.policy} from ${change.schema}.${change.table}`;
    case "pruneOrphanPolicies":
      return "Remove row policies for database roles that no longer have access to the table";
  }
}

// One change as labelled fields, for the record of a save: what was done, to which role, on
// which table.
export function describeFields(change: WireChange | null): [string, string][] {
  if (!change) {
    return [["Action", "Unknown change"]];
  }
  const target = (schema: string, table: string): [string, string] =>
    table === "*" ? ["Tables", `every table in ${schema}`] : ["Table", `${schema}.${table}`];
  switch (change.kind) {
    case "grant":
      return [
        ["Action", change.grant ? "Grant" : "Revoke"],
        ["Role", change.role],
        target(change.schema, change.table),
      ];
    case "membership":
      return [
        ["Action", change.add ? "Add to functional role" : "Remove from functional role"],
        ["Role", change.member],
        ["Functional role", change.role],
      ];
    case "createRole":
      return [
        ["Action", "Create database role"],
        ["Role", change.role],
        ["Kind", change.roleKind],
      ];
    case "dropRole":
      return [
        ["Action", "Delete database role"],
        ["Role", change.role],
      ];
    case "enableRls":
      return [
        ["Action", "Turn on row security"],
        ["Table", `${change.schema}.${change.table}`],
      ];
    case "disableRls":
      return [
        ["Action", "Turn off row security"],
        ["Table", `${change.schema}.${change.table}`],
      ];
    case "createRowPolicy":
      return [
        ["Action", "Add row policy"],
        ["Role", change.role],
        ["Table", `${change.schema}.${change.table}`],
        ["Column", change.column],
        ["Is one of", describeValues(change.values.map(String))],
      ];
    case "dropRowPolicy":
      return [
        ["Action", "Remove row policy"],
        ["Table", `${change.schema}.${change.table}`],
        ["Policy", change.policy],
      ];
    case "pruneOrphanPolicies":
      return [["Action", "Remove row policies of roles that lost access to the table"]];
  }
}
