import { useState } from "react";

import { tableKey } from "../lib/access";
import { rolesWithAccess } from "../lib/nodes";
import type { Model } from "../lib/nodes";
import { describeValues, effectivePolicies } from "../lib/policies";
import type { RlsTable, RowPolicy } from "../lib/policies";
import { AddPolicyModal } from "./AddPolicyModal";
import { DisableRlsModal } from "./DisableRlsModal";
import { EnableRlsModal } from "./EnableRlsModal";
import { RoleList } from "./RoleList";
import { RoleName } from "./RoleName";
import { Segmented } from "./Tabs";

type Perspective = "table" | "role";

const PERSPECTIVES: { value: Perspective; label: string }[] = [
  { value: "table", label: "By table" },
  { value: "role", label: "By database role" },
];

const sameTable = (a: RlsTable, b: RlsTable) =>
  a.schema === b.schema && a.table === b.table;

// Row security: which tables are locked down, and which rows each database role can see.
// A table with row security on shows no rows to anyone until a policy allows some. Policies
// add up: a role sees a row if any policy that applies to it allows the row.
export function RowPoliciesTab({ model }: { model: Model }) {
  const [perspective, setPerspective] = useState<Perspective>("table");
  const [picked, setPicked] = useState<RlsTable | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [enabling, setEnabling] = useState(false);
  const [disabling, setDisabling] = useState<RlsTable | null>(null);
  const [addingPolicy, setAddingPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<RowPolicy | null>(null);

  const tables = model.rls.tables;
  // If the selected table went away (turned off, or its queued change was taken back), fall
  // back to the first one.
  const table = (picked && tables.find((t) => sameTable(t, picked))) || tables[0] || null;
  const role =
    (selectedRole && model.roles.some((r) => r.name === selectedRole)
      ? selectedRole
      : null) ??
    model.roles[0]?.name ??
    null;

  return (
    <div className="tab-content">
      <Segmented options={PERSPECTIVES} value={perspective} onChange={setPerspective} />

      {perspective === "table" ? (
        <div className="layout">
          <div className="card card--side">
            <button
              type="button"
              className="btn btn--primary btn--block"
              disabled={model.editing.busy}
              onClick={() => setEnabling(true)}
            >
              Add row security to a table
            </button>
            <div className="section-title">Tables with row security</div>
            {tables.length === 0 && (
              <p className="empty">No table has row security yet.</p>
            )}
            {tables.map((t) => {
              const count = model.rls.policies.filter(
                (p) => p.managed && p.schema === t.schema && p.table === t.table,
              ).length;
              const active = table !== null && sameTable(t, table);
              return (
                <div key={tableKey(t.schema, t.table)} className="row-line">
                  <button
                    type="button"
                    className={`row${active ? " row--active" : ""}`}
                    onClick={() => setPicked(t)}
                  >
                    <span className="row-label">
                      <span className="prefix">{t.schema}.</span>
                      {t.table}
                    </span>
                    {t.pending && <span className="badge">new</span>}
                    <span className="count">{count}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn--danger btn--small row-action"
                    disabled={model.editing.busy}
                    title="Turn off row security for this table"
                    onClick={() => setDisabling(t)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card card--main">
            {table ? (
              <TablePolicies
                model={model}
                table={table}
                onAdd={() => setAddingPolicy(true)}
                onEdit={setEditingPolicy}
              />
            ) : (
              <p className="empty">
                Choose Add row security to a table to lock a table down, then decide
                which rows each database role can see.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="layout">
          <div className="card card--side">
            <RoleList roles={model.roles} selected={role} onSelect={setSelectedRole} />
          </div>
          <div className="card card--main">
            {role && <RolePolicies model={model} role={role} />}
          </div>
        </div>
      )}

      <div className="card card--auto coming-soon">
        <h2>Column policies: coming soon</h2>
        <p>
          Row policies decide which rows a database role sees. A column policy would decide
          which columns: for example, everything except one column. Postgres can&apos;t hide
          a single column from a role that can read the whole table, so it needs a different
          approach, and it isn&apos;t part of this app yet.
        </p>
      </div>

      {enabling && (
        <EnableRlsModal
          model={model}
          onClose={() => setEnabling(false)}
          onEnabled={(t) => setPicked(t)}
        />
      )}
      {disabling && (
        <DisableRlsModal model={model} table={disabling} onClose={() => setDisabling(null)} />
      )}
      {addingPolicy && table && (
        <AddPolicyModal model={model} table={table} onClose={() => setAddingPolicy(false)} />
      )}
      {editingPolicy && (
        <AddPolicyModal
          model={model}
          table={{ schema: editingPolicy.schema, table: editingPolicy.table }}
          policy={editingPolicy}
          onClose={() => setEditingPolicy(null)}
        />
      )}
    </div>
  );
}

function PolicyLine({
  policy,
  onRemove,
  onEdit,
  busy,
}: {
  policy: RowPolicy;
  onRemove?: () => void;
  onEdit?: () => void;
  busy: boolean;
}) {
  return (
    <div className={`policy${policy.pending ? " policy--pending" : ""}`}>
      <div className="policy-text">
        <RoleName name={policy.role} />
        {policy.pending && <span className="badge">new</span>}
        {policy.managed ? (
          <div className="policy-rule">
            sees only rows where <strong>{policy.column}</strong> is one of:{" "}
            {describeValues(policy.values)}
          </div>
        ) : (
          <>
            <span className="badge">not managed by this app</span>
            <div className="policy-rule">
              <code className="sql">{policy.definition || "No rule recorded"}</code>
            </div>
          </>
        )}
      </div>
      {(onEdit || onRemove) && (
        <div className="policy-actions row-action">
          {onEdit && (
            <button type="button" className="btn btn--small" disabled={busy} onClick={onEdit}>
              Edit
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              className="btn btn--danger btn--small"
              disabled={busy}
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// The right side of "By table": the policies on one table, and who would see nothing.
function TablePolicies({
  model,
  table,
  onAdd,
  onEdit,
}: {
  model: Model;
  table: RlsTable;
  onAdd: () => void;
  onEdit: (policy: RowPolicy) => void;
}) {
  const policies = model.rls.policies.filter(
    (p) => p.schema === table.schema && p.table === table.table,
  );
  const withAccess = rolesWithAccess(model, table.schema, table.table);
  const seesNothing = withAccess.filter((name) => {
    const found = effectivePolicies(
      name,
      model.rls.policies.filter((p) => p.managed),
      model.access.ancestors,
      table.schema,
      table.table,
    );
    return found.own.length + found.inherited.length === 0;
  });
  // A policy this app didn't create may let some roles through, so the list below is only
  // certain for policies this app manages.
  const hasUnmanaged = policies.some((p) => !p.managed);

  return (
    <>
      <div className="tab-toolbar">
        <h2>
          {table.schema}.{table.table}
          {table.pending && <span className="badge">new</span>}
        </h2>
        <button
          type="button"
          className="btn btn--primary"
          disabled={model.editing.busy}
          onClick={onAdd}
        >
          Add policy
        </button>
      </div>

      <p className="tab-note">
        Row security is on. A database role that can read this table sees no rows unless a
        policy lets it. Policies add up: if one lets a role see the US and another lets it see
        Canada, it sees both. Adding a policy can only give a role more rows, never fewer. The
        connection role Metabase uses to sync and scan still sees every row.
      </p>

      {policies.length === 0 && (
        <p className="empty">No policies yet, so every database role sees no rows here.</p>
      )}
      {policies.map((policy) => (
        <PolicyLine
          key={`${policy.name}-${policy.role}-${policy.column}-${policy.values.join(",")}`}
          policy={policy}
          busy={model.editing.busy}
          onEdit={policy.managed ? () => onEdit(policy) : undefined}
          onRemove={
            policy.managed ? () => model.editing.stageDropPolicy(policy) : undefined
          }
        />
      ))}

      {seesNothing.length > 0 && (
        <div className="notice" role="note">
          <strong>Can read this table but sees no rows:</strong>
          <ul className="plain-list">
            {seesNothing.map((name) => (
              <li key={name}>
                <RoleName name={name} />
              </li>
            ))}
          </ul>
          {hasUnmanaged && (
            <p className="hint">
              A policy this app doesn&apos;t manage may let some of these roles see rows.
            </p>
          )}
        </div>
      )}
    </>
  );
}

// The right side of "By database role": every locked-down table this role can read, and what
// it sees in each. Read-only. Change policies in By table.
function RolePolicies({ model, role }: { model: Model; role: string }) {
  const managed = model.rls.policies.filter((p) => p.managed);
  const roleIsNew = model.roles.find((r) => r.name === role)?.pending;
  const readable = model.rls.tables.filter(
    (t) =>
      model.access.tableNodeAccess(role, tableKey(t.schema, t.table)).mark !== "none",
  );
  const others = model.rls.tables.length - readable.length;

  return (
    <>
      <h2>
        <RoleName name={role} isNew={roleIsNew} />
      </h2>
      <p className="tab-note">
        The tables with row security on that this database role can read, and which rows it
        sees in each. A table without row security isn&apos;t listed: the role sees every row
        of it. To change a policy, use By table.
      </p>
      {readable.length === 0 && (
        <p className="empty">
          This database role can&apos;t read any table with row security.
          {others > 0 &&
            ` ${others} ${others === 1 ? "table has" : "tables have"} row security.`}
        </p>
      )}
      {readable.map((t) => {
        const found = effectivePolicies(
          role,
          managed,
          model.access.ancestors,
          t.schema,
          t.table,
        );
        const none = found.own.length + found.inherited.length === 0;
        return (
          <div key={tableKey(t.schema, t.table)} className="role-table">
            <div className="section-title">
              {t.schema}.{t.table}
            </div>
            {none && (
              <div className="notice" role="note">
                Has access but no policy, so it sees no rows.
              </div>
            )}
            {found.own.map((policy) => (
              <PolicyLine key={`own-${policy.name}-${policy.column}`} policy={policy} busy />
            ))}
            {found.inherited.map((policy) => (
              <div key={`via-${policy.name}-${policy.column}`}>
                <PolicyLine policy={policy} busy />
                <div className="hint">Inherited from {policy.role}</div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
