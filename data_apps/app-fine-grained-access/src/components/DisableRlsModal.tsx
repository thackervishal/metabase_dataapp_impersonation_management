import { useState } from "react";

import type { Model } from "../lib/nodes";
import { describeValues } from "../lib/policies";
import type { RlsTable } from "../lib/policies";
import { Modal } from "./Modal";
import { RoleName } from "./RoleName";

// Turning row security off removes every policy this app created on the table, so nothing is
// left behind, and then everyone who can read the table sees all of its rows again. You type
// the table's name to confirm. Confirming queues the change; nothing happens until Apply.
export function DisableRlsModal({
  model,
  table,
  onClose,
}: {
  model: Model;
  table: RlsTable;
  onClose: () => void;
}) {
  const [confirmation, setConfirmation] = useState("");
  const name = `${table.schema}.${table.table}`;
  const confirmed = confirmation.trim() === name;

  const policies = model.rls.policies.filter(
    (p) => p.schema === table.schema && p.table === table.table,
  );
  const managed = policies.filter((p) => p.managed);
  const others = policies.length - managed.length;

  const submit = () => {
    if (!confirmed) {
      return;
    }
    model.editing.stageDisableRls(table.schema, table.table);
    onClose();
  };

  return (
    <Modal title="Turn off row security" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="warning" role="alert">
          <p>
            <strong>{name}</strong> will be open again: every database role that can read it
            will see all of its rows.
          </p>
          <p>
            {managed.length > 0
              ? `These ${managed.length} row ${managed.length === 1 ? "policy" : "policies"} will be removed:`
              : "It has no row policies from this app."}
          </p>
          {managed.length > 0 && (
            <ul className="plain-list">
              {managed.map((policy) => (
                <li key={`${policy.name}-${policy.role}`}>
                  <RoleName name={policy.role} /> where {policy.column} is one of:{" "}
                  {describeValues(policy.values)}
                </li>
              ))}
            </ul>
          )}
          {others > 0 && (
            <p>
              {others} {others === 1 ? "policy" : "policies"} this app didn&apos;t create will be
              left alone. With row security off, they have no effect.
            </p>
          )}
        </div>

        <label className="field">
          <span className="field-label">Type the table name to confirm</span>
          <span className="input-group">
            <input
              type="text"
              value={confirmation}
              placeholder={name}
              autoComplete="off"
              autoFocus
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </span>
          <span className="hint">
            Type <strong>{name}</strong> exactly to enable the button.
          </span>
        </label>

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--danger"
            disabled={!confirmed || model.editing.busy}
          >
            Turn off row security
          </button>
        </div>
      </form>
    </Modal>
  );
}
