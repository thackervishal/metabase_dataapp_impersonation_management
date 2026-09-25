// Pure functions that turn the raw grants and memberships into "who can read what".
// No React and no queries in here, so the rules are easy to read and to test.

export type Grant = { role: string; schema: string; table: string };
export type Membership = { member: string; role: string };
export type Role = { name: string; kind: string; pending?: boolean }; // pending: queued to be created

// One table's access for one role.
export type TableAccess = {
  direct: boolean; // granted to this role itself
  via: string[]; // roles this role belongs to that grant it
};

// What an icon shows.
// direct: granted to the role itself. inherited: comes from a role it belongs to.
// partial: some of the tables under a schema or database. none: no access.
export type Mark = "direct" | "inherited" | "partial" | "none";

export type NodeAccess = {
  mark: Mark;
  covered: number; // tables the role can read (directly or through a role)
  total: number;
  via: string[]; // roles the access comes through
};

// Every role this app manages starts with one of these, which also says what kind it is
// (imp = impersonation, fn = functional, pr = person, rl = role).
export const ROLE_PREFIX = {
  functional: "imp_fn_rl_",
  person: "imp_pr_rl_",
} as const;

// Postgres cuts identifiers longer than 63 bytes without saying so, so a longer name
// would create a role with a different name than the one asked for. The database refuses
// them too; this is here so the form can say so before anything is queued.
export const MAX_ROLE_NAME_LENGTH = 63;

// The prefix a role name starts with, or null if it isn't one of ours.
export function prefixOf(name: string): string | null {
  return (
    Object.values(ROLE_PREFIX).find((prefix) => name.startsWith(prefix)) ?? null
  );
}

export const tableKey = (schema: string, table: string) =>
  `${schema}.${table}`;

// The text shown when you hover an icon. The roles and counts live here, not on screen.
export function describeAccess(access: NodeAccess, isGroup: boolean): string {
  const through = access.via.length > 0 ? ` through ${access.via.join(", ")}` : "";
  switch (access.mark) {
    case "direct":
      return isGroup ? "Can read every table here" : "Granted directly";
    case "inherited":
      return isGroup
        ? `Can read every table here${through}`
        : `Can read this table${through}`;
    case "partial":
      return `Can read ${access.covered} of ${access.total} tables${through}`;
    default:
      return "No access";
  }
}

// Functional database roles first, then person database roles, then anything unclassified.
export function roleGroups(roles: Role[]): { title: string; roles: Role[] }[] {
  const functional = roles.filter((role) => role.kind === "functional");
  const people = roles.filter((role) => role.kind === "person");
  const other = roles.filter(
    (role) => role.kind !== "functional" && role.kind !== "person",
  );
  return [
    { title: "Functional database roles", roles: functional },
    { title: "Person database roles", roles: people },
    { title: "Other database roles", roles: other },
  ].filter((group) => group.roles.length > 0);
}

export function buildAccess(grants: Grant[], memberships: Membership[]) {
  const direct = new Map<string, Set<string>>(); // role -> table keys
  for (const grant of grants) {
    const keys = direct.get(grant.role) ?? new Set<string>();
    keys.add(tableKey(grant.schema, grant.table));
    direct.set(grant.role, keys);
  }

  const parents = new Map<string, string[]>(); // role -> roles it belongs to
  for (const { member, role } of memberships) {
    parents.set(member, [...(parents.get(member) ?? []), role]);
  }

  // Every role this role belongs to, directly or through other roles.
  function ancestors(role: string): string[] {
    const seen = new Set<string>();
    const queue = [...(parents.get(role) ?? [])];
    while (queue.length > 0) {
      const next = queue.shift() as string;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(...(parents.get(next) ?? []));
      }
    }
    return [...seen];
  }

  function tableAccess(role: string, key: string): TableAccess {
    return {
      direct: direct.get(role)?.has(key) ?? false,
      via: ancestors(role).filter((parent) => direct.get(parent)?.has(key)),
    };
  }

  // Summary for a schema or the whole database: how many of its tables the role can read.
  function groupAccess(role: string, keys: string[]): NodeAccess {
    const accesses = keys.map((key) => tableAccess(role, key));
    const covered = accesses.filter((a) => a.direct || a.via.length > 0);
    const via = [...new Set(covered.flatMap((a) => a.via))];

    let mark: Mark = "none";
    if (covered.length > 0) {
      mark = "partial";
    }
    if (covered.length === keys.length && keys.length > 0) {
      mark = accesses.every((a) => a.direct) ? "direct" : "inherited";
    }
    return { mark, covered: covered.length, total: keys.length, via };
  }

  function tableNodeAccess(role: string, key: string): NodeAccess {
    const access = tableAccess(role, key);
    let mark: Mark = "none";
    if (access.direct) {
      mark = "direct";
    } else if (access.via.length > 0) {
      mark = "inherited";
    }
    return {
      mark,
      covered: mark === "none" ? 0 : 1,
      total: 1,
      via: access.via,
    };
  }

  return { groupAccess, tableNodeAccess };
}

export type Access = ReturnType<typeof buildAccess>;

// Direct memberships in both directions: who is in a role, and which roles someone is in.
export function buildMappings(memberships: Membership[]) {
  const membersOf = new Map<string, string[]>();
  const rolesOf = new Map<string, string[]>();
  for (const { member, role } of memberships) {
    membersOf.set(role, [...(membersOf.get(role) ?? []), member]);
    rolesOf.set(member, [...(rolesOf.get(member) ?? []), role]);
  }
  return {
    membersOf: (role: string) => membersOf.get(role) ?? [],
    rolesOf: (member: string) => rolesOf.get(member) ?? [],
  };
}

export type Mappings = ReturnType<typeof buildMappings>;
