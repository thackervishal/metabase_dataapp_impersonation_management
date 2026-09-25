import { useState } from "react";

import { rolesWithAccess } from "../lib/nodes";
import type { Model } from "../lib/nodes";
import { describeValues, parseValueList, policyIdentity } from "../lib/policies";
import type { RlsTable, RowPolicy } from "../lib/policies";
import { Modal } from "./Modal";

// Lets a database role see only the rows where a column is one of some values. "is one of" is
// the only rule for now. The rule is a column, an operator, and values, so more operators
// (between, is not one of) can be added here later without changing the rest of the screen.
// Adding queues the change; nothing happens until Apply. With `policy`, it edits that policy
// instead: the database role stays the same, and the column and values can change.
export function AddPolicyModal({
  model,
  table,
  policy,
  onClose,
}: {
  model: Model;
  table: RlsTable;
  policy?: RowPolicy;
  onClose: () => void;
}) {
  // Only roles that can already read the table. A policy narrows what a role can see, so
  // a role that can't read the table has nothing to narrow.
  const eligible = policy ? [policy.role] : rolesWithAccess(model, table.schema, table.table);
  const excluded = policy ? 0 : model.roles.length - eligible.length;
  const columns = model.rls.columns.filter(
    (c) => c.schema === table.schema && c.table === table.table,
  );

  const [role, setRole] = useState(eligible[0] ?? "");
  const [columnName, setColumnName] = useState(policy?.column ?? columns[0]?.column ?? "");
  const [text, setText] = useState(policy ? policy.values.join(", ") : "");
  const [showError, setShowError] = useState(false);

  const chosenRole = eligible.includes(role) ? role : (eligible[0] ?? "");
  const column = columns.find((c) => c.column === columnName) ?? columns[0];
  const parsed = column ? parseValueList(text, column) : null;

  // The policy being edited is replaced, so it is not one of "the others".
  const isSelf = (p: RowPolicy) =>
    policy !== undefined && p.pending === policy.pending && policyIdentity(p) === policyIdentity(policy);
  const existing = model.rls.policies.filter(
    (p) =>
      !isSelf(p) && p.managed && p.role === chosenRole && p.schema === table.schema && p.table === table.table,
  );
  const duplicate =
    column && parsed?.values
      ? model.rls.policies.some(
          (p) =>
            !isSelf(p) &&
            policyIdentity(p) ===
            policyIdentity({
              role: chosenRole,
              schema: table.schema,
              table: table.table,
              column: column.column,
              values: parsed.values,
            }),
        )
      : false;
  const unchanged =
    policy !== undefined &&
    column !== undefined &&
    parsed?.values != null &&
    policyIdentity({ ...policy, column: column.column, values: parsed.values }) ===
      policyIdentity(policy);
  const problem = unchanged
    ? "Change the column or the values first."
    : !chosenRole
    ? "No database role can read this table yet. Give one access in the Permissions tab first."
    : !column
      ? "This table has no columns a policy can use."
      : (parsed?.error ?? (duplicate ? "This role already has that policy." : null));

  const submit = () => {
    if (problem || !column || !parsed?.values) {
      setShowError(true);
      return;
    }
    if (policy) {
      model.editing.stageEditPolicy(policy, column, parsed.values);
    } else {
      model.editing.stageCreatePolicy(chosenRole, column, parsed.values);
    }
    onClose();
  };

  return (
    <Modal title={policy ? "Edit a row policy" : "Add a row policy"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <p>
          On{" "}
          <strong>
            {table.schema}.{table.table}
          </strong>
          . The database role will see only the rows that match.
        </p>

        <label className="field">
          <span className="field-label">Database role</span>
          {policy ? (
            <span className="input-group input-group--readonly">
              <input type="text" value={chosenRole} readOnly tabIndex={-1} />
            </span>
          ) : (
            <select value={chosenRole} onChange={(event) => setRole(event.target.value)}>
              {eligible.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          <span className="hint">
            {policy
              ? "The database role can't be changed. To give another role a policy, add one."
              : "Only database roles that can read this table are listed, directly or through a functional role"}
            {excluded > 0 &&
              `. ${excluded} ${excluded === 1 ? "role isn't" : "roles aren't"} listed because ${excluded === 1 ? "it can't" : "they can't"} read it`}
            {!policy && ". If a role later loses access to the table, its policies here are removed too."}
          </span>
        </label>

        <label className="field">
          <span className="field-label">Column</span>
          <select value={column?.column ?? ""} onChange={(event) => setColumnName(event.target.value)}>
            {columns.map((c) => (
              <option key={c.column} value={c.column}>
                {c.column} ({c.dataType})
              </option>
            ))}
          </select>
          <span className="hint">Text, number, and true/false columns.</span>
        </label>

        <label className="field">
          <span className="field-label">is one of</span>
          <span className="input-group">
            <input
              type="text"
              value={text}
              placeholder={column?.kind === "number" ? "1, 2, 3" : "United States, Canada"}
              autoComplete="off"
              autoFocus
              onChange={(event) => {
                setText(event.target.value);
                setShowError(false);
              }}
            />
          </span>
          <span className="hint">
            Separate values with commas. A value can&apos;t contain a comma.
          </span>
        </label>

        {existing.length > 0 && (
          <div className="notice" role="note">
            This role already sees rows where:
            <ul className="plain-list">
              {existing.map((policy) => (
                <li key={`${policy.name}-${policy.column}-${policy.values.join(",")}`}>
                  {policy.column} is one of: {describeValues(policy.values)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="hint">
          Policies add up. A new policy can only let this role, and any person in it, see more
          rows. It never takes rows away.
        </p>

        {showError && problem && <p className="error">{problem}</p>}

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={model.editing.busy || !chosenRole}
          >
            {policy ? "Save policy" : "Add policy"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
