// Row policies: "this role only sees the rows where a column is one of these values".
// Plain functions, no React and no queries.

// What a row policy can filter on. Anything else (dates, JSON, and so on) can't be used yet.
export type ColumnKind = "text" | "number" | "boolean";

export type RlsTable = { schema: string; table: string; pending?: boolean };

export type RowPolicy = {
  name: string; // the database's name for it; empty while it's only queued
  role: string;
  schema: string;
  table: string;
  column: string; // empty for a policy this app didn't create
  values: string[];
  managed: boolean; // created by this app. Others are shown read-only and never changed.
  definition: string; // the rule as Postgres stores it, used to show unmanaged policies
  pending?: boolean;
};

export type ColumnInfo = {
  schema: string;
  table: string;
  column: string;
  dataType: string;
  kind: ColumnKind;
};

export const MAX_POLICY_VALUES = 200;
export const MAX_VALUE_LENGTH = 200;

export function columnKind(value: string): ColumnKind | null {
  return value === "text" || value === "number" || value === "boolean" ? value : null;
}

// Reads the values the database stored in a policy's comment. A bad value gives no values.
export function parseStoredValues(text: unknown): string[] {
  try {
    const parsed: unknown = JSON.parse(String(text));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

const isWholeNumberType = (dataType: string) => /int|serial/i.test(dataType);

// Turns what someone typed ("US, CA, MX") into a clean list, or says what's wrong with it.
export function parseValueList(
  text: string,
  column: ColumnInfo,
): { values: string[]; error: null } | { values: null; error: string } {
  const seen = new Set<string>();
  const values: string[] = [];
  for (const piece of text.split(",")) {
    const value = piece.trim();
    if (value !== "" && !seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }
  if (values.length === 0) {
    return { values: null, error: "Enter at least one value." };
  }
  if (values.length > MAX_POLICY_VALUES) {
    return { values: null, error: `Use at most ${MAX_POLICY_VALUES} values.` };
  }
  const tooLong = values.find((value) => value.length > MAX_VALUE_LENGTH);
  if (tooLong) {
    return { values: null, error: `Each value can be at most ${MAX_VALUE_LENGTH} characters.` };
  }
  if (column.kind === "number") {
    const pattern = isWholeNumberType(column.dataType) ? /^-?\d+$/ : /^-?\d+(\.\d+)?$/;
    const bad = values.find((value) => !pattern.test(value));
    if (bad) {
      return {
        values: null,
        error: isWholeNumberType(column.dataType)
          ? `"${bad}" isn't a whole number, and ${column.column} holds whole numbers.`
          : `"${bad}" isn't a number.`,
      };
    }
  }
  if (column.kind === "boolean") {
    const bad = values.find((value) => !/^(true|false)$/i.test(value));
    if (bad) {
      return { values: null, error: `"${bad}" isn't true or false.` };
    }
    return { values: [...new Set(values.map((value) => value.toLowerCase()))], error: null };
  }
  return { values, error: null };
}

// The values as the database wants them: strings, numbers, or booleans.
export function toWireValues(values: string[], kind: ColumnKind): (string | number | boolean)[] {
  if (kind === "number") {
    return values.map(Number);
  }
  if (kind === "boolean") {
    return values.map((value) => value === "true");
  }
  return values;
}

export const describeValues = (values: string[]) => values.join(", ");

// A policy for the same role, table, column, and values is the same policy.
export function policyIdentity(policy: {
  role: string;
  schema: string;
  table: string;
  column: string;
  values: string[];
}): string {
  return [
    policy.role,
    `${policy.schema}.${policy.table}`,
    policy.column,
    [...policy.values].sort().join("\u0001"),
  ].join("|");
}

// What a role sees on a table with row security on: its own policies, and the ones on the
// roles it belongs to. Policies add up, so any one of them lets a row through.
export function effectivePolicies(
  role: string,
  policies: RowPolicy[],
  ancestors: (role: string) => string[],
  schema: string,
  table: string,
): { own: RowPolicy[]; inherited: RowPolicy[] } {
  const parents = new Set(ancestors(role));
  const onTable = policies.filter((p) => p.schema === schema && p.table === table);
  return {
    own: onTable.filter((p) => p.role === role),
    inherited: onTable.filter((p) => p.role !== role && parents.has(p.role)),
  };
}
