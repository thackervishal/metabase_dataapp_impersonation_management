import {
  useAction,
  useMetabaseQuery,
} from "@metabase/embedding-sdk-react/data-app";
import { useEffect, useRef, useState } from "react";

import "./app.css";
import { CreateBatch } from "../actions/batch.action";
import { Grants } from "../queries/grants.query";
import { Batches } from "../queries/batches.query";
import { Columns } from "../queries/columns.query";
import { RlsTables } from "../queries/rls-tables.query";
import { RowPolicies } from "../queries/row-policies.query";
import { Memberships } from "../queries/memberships.query";
import { Roles } from "../queries/roles.query";
import { SchemaTree } from "../queries/schema-tree.query";
import { ApplyBar } from "./components/ApplyBar";
import { AuditTab } from "./components/AuditTab";
import { ManageRolesTab } from "./components/ManageRolesTab";
import { MappingsTab } from "./components/MappingsTab";
import { PermissionsTab } from "./components/PermissionsTab";
import { RowPoliciesTab } from "./components/RowPoliciesTab";
import { SaveResult } from "./components/SaveResult";
import { TabBar } from "./components/Tabs";
import { ROLE_PREFIX, buildAccess, buildMappings } from "./lib/access";
import type { Grant, Membership, Role } from "./lib/access";
import { toWire } from "./lib/batch";
import type { BatchRecord } from "./lib/batch";
import { addChange, applyChanges, removeChange, settleQueue } from "./lib/changes";
import type { Change, RoleKind } from "./lib/changes";
import type { Editing, Model, Node } from "./lib/nodes";
import {
  columnKind,
  parseStoredValues,
  policyIdentity,
} from "./lib/policies";
import type { ColumnInfo, RlsTable, RowPolicy } from "./lib/policies";
import schema from "./metabase.data";

// Result rows are keyed by the column names Metabase returns ("role_name").
// Reading them from the generated schema avoids typing the strings by hand.
const roleFields = schema.tables.vRoles.fields;
const grantFields = schema.tables.vGrants.fields;
const membershipFields = schema.tables.vMemberships.fields;
const treeFields = schema.tables.vSchemaTree.fields;
const batchFields = schema.tables.vBatches.fields;
const rlsTableFields = schema.tables.vRlsTables.fields;
const policyFields = schema.tables.vRowPolicies.fields;
const columnFields = schema.tables.vColumns.fields;

type TabName = "permissions" | "rows" | "mappings" | "manage" | "audit";

const TABS: { value: TabName; label: string }[] = [
  { value: "manage", label: "Manage Database Roles" },
  { value: "mappings", label: "Database Role Mappings" },
  { value: "permissions", label: "Permissions" },
  { value: "rows", label: "Row and Column Policies" },
  { value: "audit", label: "Audit History" },
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
  const batchQuery = useMetabaseQuery(Batches);
  const rlsQuery = useMetabaseQuery(RlsTables);
  const policyQuery = useMetabaseQuery(RowPolicies);
  const columnQuery = useMetabaseQuery(Columns);

  const createBatch = useAction(CreateBatch);

  const [tab, setTab] = useState<TabName>("manage");
  // Changes people have asked for. Nothing runs until they press Apply.
  const [pending, setPending] = useState<Change[]>([]);
  const [applying, setApplying] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // Which save's result is showing. It stays empty until you press Apply.
  const [resultId, setResultId] = useState<number | null>(null);
  // A save whose result we haven't seen yet: what we sent, and the newest batch before it.
  const inflight = useRef<{ payload: string; previousId: number } | null>(null);

  // Only the first load replaces the screen with "Loading…". A reload after a change
  // must not, or the tabs would unmount and forget what you had selected.
  const loadedOnce = useRef(false);
  const isLoading =
    roles.isLoading ||
    grants.isLoading ||
    memberships.isLoading ||
    tree.isLoading ||
    batchQuery.isLoading ||
    rlsQuery.isLoading ||
    policyQuery.isLoading ||
    columnQuery.isLoading;
  if (!isLoading) {
    loadedOnce.current = true;
  }
  const error =
    roles.error ??
    grants.error ??
    memberships.error ??
    tree.error ??
    batchQuery.error ??
    rlsQuery.error ??
    policyQuery.error ??
    columnQuery.error;

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

  const rlsTableList: RlsTable[] = (rlsQuery.data?.rows ?? []).map((row) => ({
    schema: String(row[rlsTableFields.schemaName.name]),
    table: String(row[rlsTableFields.tableName.name]),
  }));
  const policyList: RowPolicy[] = (policyQuery.data?.rows ?? []).map((row) => {
    const managed = String(row[policyFields.isManaged.name]) === "true";
    return {
      name: String(row[policyFields.policyName.name]),
      role: String(row[policyFields.roleName.name]),
      schema: String(row[policyFields.schemaName.name]),
      table: String(row[policyFields.tableName.name]),
      column: String(row[policyFields.filterColumn.name] ?? ""),
      values: managed ? parseStoredValues(row[policyFields.filterValues.name]) : [],
      managed,
      definition: String(row[policyFields.definition.name] ?? ""),
    };
  });
  const columnList: ColumnInfo[] = (columnQuery.data?.rows ?? []).flatMap((row) => {
    const kind = columnKind(String(row[columnFields.typeKind.name]));
    return kind
      ? [
          {
            schema: String(row[columnFields.schemaName.name]),
            table: String(row[columnFields.tableName.name]),
            column: String(row[columnFields.columnName.name]),
            dataType: String(row[columnFields.dataType.name]),
            kind,
          },
        ]
      : [];
  });

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

  // The database's own record of past saves, newest first. The first one is the latest.
  const batchList: BatchRecord[] = (batchQuery.data?.rows ?? []).map((row) => ({
    id: Number(row[batchFields.batchId.name]),
    requestedAt: String(row[batchFields.requestedAt.name]),
    status: String(row[batchFields.status.name]),
    errorMessage: row[batchFields.errorMessage.name]
      ? String(row[batchFields.errorMessage.name])
      : null,
    changes: String(row[batchFields.changes.name]),
    results: String(row[batchFields.results.name] ?? ""),
  }));
  const latestBatch: BatchRecord | null = batchList[0] ?? null;
  // The save whose result is on screen. Nothing shows until you press Apply.
  const shownBatch = batchList.find((batch) => batch.id === resultId) ?? null;

  // If a save's response never reached us (a network error, say), the database's record
  // still tells us what happened. When a newer batch appears that holds exactly what we
  // sent, use its status. This is what makes a lost response safe.
  const latestId = latestBatch?.id;
  useEffect(() => {
    const sent = inflight.current;
    if (
      !sent ||
      !latestBatch ||
      latestBatch.id <= sent.previousId ||
      latestBatch.changes !== sent.payload
    ) {
      return;
    }
    inflight.current = null;
    setResultId(latestBatch.id);
    if (latestBatch.status === "applied") {
      setPending([]);
      setSaveError(null);
    } else {
      setSaveError(
        `Nothing was changed. ${latestBatch.errorMessage ?? "The database refused the batch."}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestId]);

  // Send the whole queue as one batch. The database applies every change in one transaction
  // and checks each one, so the result is all or nothing, and it comes back in the row it
  // wrote. On failure the queue stays, so nothing is lost.
  async function apply() {
    const wire = pending.flatMap((change) => toWire(change, tables));
    const payload = JSON.stringify(wire);
    inflight.current = { payload, previousId: latestBatch?.id ?? 0 };
    setApplying(true);
    setSaveError(null);
    setNotice(null);
    try {
      const response = await createBatch.execute({ changes: payload });
      const created = (
        response as { "created-row"?: Record<string, unknown> } | null
      )?.["created-row"];

      if (created?.status === "applied") {
        inflight.current = null;
        setResultId(Number(created.id));
        setPending([]);
      } else if (created?.status === "failed") {
        inflight.current = null;
        setResultId(Number(created.id));
        setSaveError(
          `Nothing was changed. ${String(created.error_message ?? "The database refused the batch.")}`,
        );
      } else {
        setSaveError("Couldn't confirm the result. See the Audit History tab for what the database recorded.");
      }
    } catch (failure) {
      // The request may or may not have reached the database. The reload below picks up
      // its record, and the effect above settles it.
      setSaveError(
        `Couldn't confirm the result (${describeError(failure)}). See the Audit History tab for what the database recorded.`,
      );
    } finally {
      await Promise.all([
        roles.refetch(),
        grants.refetch(),
        memberships.refetch(),
        batchQuery.refetch(),
        rlsQuery.refetch(),
        policyQuery.refetch(),
      ]);
      setApplying(false);
    }
  }

  // Every edit to the queue goes through here. A queued row policy that depended on something
  // that was just taken back is removed too, and you're told, so Apply can't fail on it.
  const update = (change: (queue: Change[]) => Change[]) => {
    const settled = settleQueue(saved, change(pending), tables);
    setPending(settled.queue);
    if (settled.dropped.length > 0) {
      const count = settled.dropped.length;
      setNotice(
        `Also removed ${count} queued row ${count === 1 ? "policy" : "policies"} that depended on it.`,
      );
    }
  };

  // The message at the top and the panel below describe the same save, so one Dismiss
  // clears both.
  const dismissResult = () => {
    setSaveError(null);
    setNotice(null);
    setResultId(null);
  };

  const stage = (change: Change) => update((queue) => addChange(queue, change));

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
      update((queue) => {
        // A role that only exists in the queue is deleted by taking its creation back out.
        const created = queue.findIndex(
          (change) => change.kind === "createRole" && change.role === role,
        );
        return created >= 0
          ? removeChange(queue, created)
          : addChange(queue, { kind: "dropRole", role });
      }),
    stageEnableRls: (schema: string, table: string) =>
      stage({ kind: "enableRls", schema, table }),
    stageDisableRls: (schema: string, table: string) =>
      update((queue) => {
        // Row security that was only queued is turned off by taking that change back out.
        const enabled = queue.findIndex(
          (change) =>
            change.kind === "enableRls" && change.schema === schema && change.table === table,
        );
        return enabled >= 0
          ? removeChange(queue, enabled)
          : addChange(queue, { kind: "disableRls", schema, table });
      }),
    stageCreatePolicy: (role: string, column: ColumnInfo, values: string[]) =>
      update((queue) => {
        const change: Change = {
          kind: "createRowPolicy",
          role,
          schema: column.schema,
          table: column.table,
          column: column.column,
          columnKind: column.kind,
          values,
        };
        // The same policy twice would be refused by the database, so don't queue it.
        const identity = policyIdentity(change);
        return projected.policies.some((policy) => policyIdentity(policy) === identity)
          ? queue
          : addChange(queue, change);
      }),
    stageDropPolicy: (policy: RowPolicy) =>
      update((queue) => {
        if (policy.pending) {
          // Only queued: take the queued change back out.
          const identity = policyIdentity(policy);
          const index = queue.findIndex(
            (change) => change.kind === "createRowPolicy" && policyIdentity(change) === identity,
          );
          return index >= 0 ? removeChange(queue, index) : queue;
        }
        const queued = queue.some(
          (change) => change.kind === "dropRowPolicy" && change.policy === policy.name,
        );
        return queued
          ? queue
          : addChange(queue, {
              kind: "dropRowPolicy",
              policy: policy.name,
              role: policy.role,
              schema: policy.schema,
              table: policy.table,
              column: policy.column,
              values: policy.values,
            });
      }),
    stageEditPolicy: (policy: RowPolicy, column: ColumnInfo, values: string[]) =>
      update((queue) => {
        let next = queue;
        if (policy.pending) {
          // Only queued: replace the queued change.
          const identity = policyIdentity(policy);
          const index = next.findIndex(
            (change) => change.kind === "createRowPolicy" && policyIdentity(change) === identity,
          );
          if (index >= 0) {
            next = removeChange(next, index);
          }
        } else {
          next = addChange(next, {
            kind: "dropRowPolicy",
            policy: policy.name,
            role: policy.role,
            schema: policy.schema,
            table: policy.table,
            column: policy.column,
            values: policy.values,
          });
        }
        return addChange(next, {
          kind: "createRowPolicy",
          role: policy.role,
          schema: column.schema,
          table: column.table,
          column: column.column,
          columnKind: column.kind,
          values,
        });
      }),
    removedPolicies: [],
    removePending: (index: number) =>
      update((queue) => removeChange(queue, index)),
    discard: () => {
      setPending([]);
      setSaveError(null);
      setNotice(null);
    },
    apply: () => void apply(),
  };

  // The database as it would be once the queue has run, and as it is now.
  const saved = {
    roles: roleList,
    grants: grantList,
    memberships: membershipList,
    rlsTables: rlsTableList,
    policies: policyList,
  };
  const projected = applyChanges(saved, pending, tables);
  editing.removedPolicies = projected.removedPolicies;

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
    rls: {
      tables: projected.rlsTables,
      policies: projected.policies,
      columns: columnList,
    },
    editing,
  };

  return (
    <div className="app">
      <div className="app-panel">
        <h1>Fine Grained Access Management</h1>

        {saveError && (
          <div className="banner banner--error" role="alert">
            <span>{saveError}</span>
            <button type="button" onClick={dismissResult}>
              Dismiss
            </button>
          </div>
        )}
        {notice && (
          <div className="banner banner--ok" role="status">
            <span>{notice}</span>
            <button type="button" onClick={dismissResult}>
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
            <div hidden={tab !== "rows"}>
              <RowPoliciesTab model={model} />
            </div>
            <div hidden={tab !== "mappings"}>
              <MappingsTab model={model} />
            </div>
            <div hidden={tab !== "manage"}>
              <ManageRolesTab model={model} />
            </div>
            <div hidden={tab !== "audit"}>
              <AuditTab batches={batchList} />
            </div>
            {shownBatch && (
              <SaveResult batch={shownBatch} onDismiss={dismissResult} />
            )}
          </>
        )}

        <ApplyBar editing={editing} databaseName={databaseName} />
      </div>
    </div>
  );
}
