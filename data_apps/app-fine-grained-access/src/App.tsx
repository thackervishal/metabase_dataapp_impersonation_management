import {
  useAction,
  useMetabaseQuery,
} from "@metabase/embedding-sdk-react/data-app";
import { useRef, useState } from "react";

import "./app.css";
import { CreateGrant } from "../actions/grants.action";
import { CreateMembership } from "../actions/memberships.action";
import { CreateRoleCommand } from "../actions/roles.action";
import { Grants } from "../queries/grants.query";
import { Memberships } from "../queries/memberships.query";
import { Roles } from "../queries/roles.query";
import { SchemaTree } from "../queries/schema-tree.query";
import { ApplyBar } from "./components/ApplyBar";
import { ManageRolesTab } from "./components/ManageRolesTab";
import { MappingsTab } from "./components/MappingsTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { TabBar } from "./components/Tabs";
import { ROLE_PREFIX, buildAccess, buildMappings } from "./lib/access";
import type { Grant, Membership, Role } from "./lib/access";
import {
  addChange,
  applyChanges,
  describeChange,
  removeChange,
} from "./lib/changes";
import type { Change, RoleKind } from "./lib/changes";
import type { Editing, Model, Node } from "./lib/nodes";
import schema from "./metabase.data";

// Result rows are keyed by the column names Metabase returns ("role_name").
// Reading them from the generated schema avoids typing the strings by hand.
const roleFields = schema.tables.vRoles.fields;
const grantFields = schema.tables.vGrants.fields;
const membershipFields = schema.tables.vMemberships.fields;
const treeFields = schema.tables.vSchemaTree.fields;

type TabName = "permissions" | "mappings" | "manage";

const TABS: { value: TabName; label: string }[] = [
  { value: "permissions", label: "Permissions" },
  { value: "mappings", label: "Database Role Mappings" },
  { value: "manage", label: "Manage Database Roles" },
];

// Postgres errors come back as a message the person can act on, so show it as it is.
function describeError(error: unknown): string {
  const data = (error as { data?: { message?: string } } | null)?.data;
  return data?.message ?? (error instanceof Error ? error.message : String(error));
}

export default function App() {
  const roles = useMetabaseQuery(Roles);
  const grants = useMetabaseQuery(Grants);
  const memberships = useMetabaseQuery(Memberships);
  const tree = useMetabaseQuery(SchemaTree);

  const createGrant = useAction(CreateGrant);
  const createMembership = useAction(CreateMembership);
  const createRoleCommand = useAction(CreateRoleCommand);

  const [tab, setTab] = useState<TabName>("permissions");
  // Changes people have asked for. Nothing runs until they press Apply.
  const [pending, setPending] = useState<Change[]>([]);
  const [applying, setApplying] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Only the first load replaces the screen with "Loading…". A reload after a change
  // must not, or the tabs would unmount and forget what you had selected.
  const loadedOnce = useRef(false);
  const isLoading =
    roles.isLoading ||
    grants.isLoading ||
    memberships.isLoading ||
    tree.isLoading;
  if (!isLoading) {
    loadedOnce.current = true;
  }
  const error = roles.error ?? grants.error ?? memberships.error ?? tree.error;

  const roleList: Role[] = (roles.data?.rows ?? []).map((row) => ({
    name: String(row[roleFields.roleName.name]),
    kind: String(row[roleFields.roleKind.name]),
  }));
  const grantList: Grant[] = (grants.data?.rows ?? []).map((row) => ({
    role: String(row[grantFields.roleName.name]),
    schema: String(row[grantFields.schemaName.name]),
    table: String(row[grantFields.tableName.name]),
  }));
  const membershipList: Membership[] = (memberships.data?.rows ?? []).map(
    (row) => ({
      member: String(row[membershipFields.memberName.name]),
      role: String(row[membershipFields.roleName.name]),
    }),
  );

  // schema -> its tables, in the order the query returned them.
  const tables: Record<string, string[]> = {};
  let databaseName = "";
  for (const row of tree.data?.rows ?? []) {
    const schemaName = String(row[treeFields.schemaName.name]);
    databaseName = String(row[treeFields.databaseName.name]);
    tables[schemaName] = [
      ...(tables[schemaName] ?? []),
      String(row[treeFields.tableName.name]),
    ];
  }

  // Run one queued change by calling the matching action.
  async function run(change: Change) {
    if (change.kind === "grant") {
      // "*" means every table in the schema; the database node does that for each schema.
      const targets =
        change.node.level === "table"
          ? [{ schema: change.node.schema, table: change.node.table }]
          : (change.node.level === "schema"
              ? [change.node.schema]
              : Object.keys(tables)
            ).map((schemaName) => ({ schema: schemaName, table: "*" }));
      for (const target of targets) {
        await createGrant.execute({
          schema_name: target.schema,
          table_name: target.table,
          role_name: change.role,
          privilege: "SELECT",
          should_grant: change.grant,
        });
      }
    } else if (change.kind === "membership") {
      await createMembership.execute({
        user_name: change.member,
        role_name: change.role,
        action: change.add ? "add" : "remove",
      });
    } else {
      await createRoleCommand.execute({
        role_name: change.role,
        action:
          change.kind === "dropRole"
            ? "drop"
            : change.roleKind === "person"
              ? "create_person"
              : "create_functional",
      });
    }
  }

  // Run the queue in order. It stops at the first change the database refuses and keeps
  // that change and everything after it queued, so nothing is lost. Whatever ran is
  // reloaded either way; the screens work out access from the loaded data, so reloading
  // redraws everything, including access that comes through a role.
  async function apply() {
    const queue = pending;
    let done = 0;
    setApplying(true);
    setSaveError(null);
    try {
      for (const change of queue) {
        await run(change);
        done += 1;
      }
    } catch (failure) {
      const failed = queue[done];
      setSaveError(
        `Change ${done + 1} of ${queue.length} failed` +
          (failed ? ` (${describeChange(failed, databaseName)})` : "") +
          `: ${describeError(failure)}`,
      );
    } finally {
      await Promise.all([
        roles.refetch(),
        grants.refetch(),
        memberships.refetch(),
      ]);
      setPending(queue.slice(done));
      setApplying(false);
    }
  }

  const stage = (change: Change) =>
    setPending((queue) => addChange(queue, change));

  const editing: Editing = {
    busy: applying,
    pending,
    stageGrant: (role: string, node: Node, grant: boolean) =>
      stage({ kind: "grant", role, node, grant }),
    stageMembership: (member: string, role: string, add: boolean) =>
      stage({ kind: "membership", member, role, add }),
    stageCreateRole: (name: string, roleKind: RoleKind) =>
      stage({ kind: "createRole", role: ROLE_PREFIX[roleKind] + name, roleKind }),
    stageDeleteRole: (role: string) =>
      setPending((queue) => {
        // A role that only exists in the queue is deleted by taking its creation back out.
        const created = queue.findIndex(
          (change) => change.kind === "createRole" && change.role === role,
        );
        return created >= 0
          ? removeChange(queue, created)
          : addChange(queue, { kind: "dropRole", role });
      }),
    removePending: (index: number) =>
      setPending((queue) => removeChange(queue, index)),
    discard: () => {
      setPending([]);
      setSaveError(null);
    },
    apply: () => void apply(),
  };

  // The database as it would be once the queue has run, and as it is now.
  const saved = { roles: roleList, grants: grantList, memberships: membershipList };
  const projected = applyChanges(saved, pending, tables);

  const model: Model = {
    databaseName,
    tables,
    roles: projected.roles,
    access: buildAccess(projected.grants, projected.memberships),
    mappings: buildMappings(projected.memberships),
    saved: {
      access: buildAccess(grantList, membershipList),
      mappings: buildMappings(membershipList),
    },
    editing,
  };

  return (
    <div className="app">
      <div className="app-panel">
        <h1>Fine Grained Access Management</h1>
        <p className="intro">
          Manage the database roles that Metabase users can be granted through
          connection impersonation. Which Metabase user uses which of these
          database roles is set in Metabase, with a user attribute and the
          impersonation settings. This app only manages the database roles and
          what they can read. Changes you make are queued and marked with a
          dashed outline. Nothing happens until you choose Apply.
        </p>

        {saveError && (
          <div className="banner banner--error" role="alert">
            <span>{saveError}</span>
            <button type="button" onClick={() => setSaveError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <TabBar options={TABS} value={tab} onChange={setTab} />

        {isLoading && !loadedOnce.current && <p>Loading…</p>}

        {error ? (
          <pre className="error">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        ) : null}

        {loadedOnce.current && !error && (
          <>
            {/* Both tabs stay mounted so each keeps its selection when you switch. */}
            <div hidden={tab !== "permissions"}>
              <PermissionsTab model={model} />
            </div>
            <div hidden={tab !== "mappings"}>
              <MappingsTab model={model} />
            </div>
            <div hidden={tab !== "manage"}>
              <ManageRolesTab model={model} />
            </div>
          </>
        )}

        <ApplyBar editing={editing} databaseName={databaseName} />
      </div>
    </div>
  );
}
