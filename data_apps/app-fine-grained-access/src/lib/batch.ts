// The batch: everything queued, sent to the database as one row, applied in one transaction.
// These are plain functions for building what's sent and reading what comes back.

import type { Change, RoleKind } from "./changes";

// One change as the database function reads it. Tables are named one by one, or "*" for every
// table in a schema, so a database-wide change becomes one entry per schema.
export type WireChange =
  | { kind: "grant"; role: string; schema: string; table: string; grant: boolean }
  | { kind: "membership"; member: string; role: string; add: boolean }
  | { kind: "createRole"; role: string; roleKind: RoleKind }
  | { kind: "dropRole"; role: string };

export function toWire(
  change: Change,
  tables: Record<string, string[]>,
): WireChange[] {
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

// What the database recorded for one change in a batch.
export type Outcome = {
  index: number;
  change: WireChange | null;
  status: "applied" | "rolled_back" | "failed";
  sql: string[];
  error: string | null;
};

export type BatchRecord = {
  id: number;
  requestedAt: string;
  status: string; // "applied" or "failed"
  errorMessage: string | null;
  changes: string; // exactly what was sent
  outcomes: Outcome[];
};

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
  }
}
