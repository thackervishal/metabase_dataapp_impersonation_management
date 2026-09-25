import { useState } from "react";

import type { Model } from "../lib/nodes";
import type { RlsTable } from "../lib/policies";
import { Modal } from "./Modal";

// Pick a table to lock down. Adding queues the change; nothing happens until Apply.
export function EnableRlsModal({
  model,
  onClose,
  onEnabled,
}: {
  model: Model;
  onClose: () => void;
  onEnabled: (table: RlsTable) => void;
}) {
  const locked = new Set(model.rls.tables.map((t) => `${t.schema}.${t.table}`));
  // Only tables that don't have row security yet.
  const available: Record<string, string[]> = {};
  for (const [schema, names] of Object.entries(model.tables)) {
    const free = names.filter((name) => !locked.has(`${schema}.${name}`));
    if (free.length > 0) {
      available[schema] = free;
    }
  }
  const schemas = Object.keys(available);

  const [schema, setSchema] = useState(schemas[0] ?? "");
  const [table, setTable] = useState("");
  const tableNames = available[schema] ?? [];
  const chosen = tableNames.includes(table) ? table : (tableNames[0] ?? "");

  const submit = () => {
    if (!schema || !chosen) {
      return;
    }
    model.editing.stageEnableRls(schema, chosen);
    onEnabled({ schema, table: chosen });
    onClose();
  };

  return (
    <Modal title="Add row security to a table" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <p>
          Turning on row security locks the table down. A database role that can read it
          still sees no rows until you add a policy that lets it see some. Use it for a table
          that holds data not everyone should see.
        </p>

        {schemas.length === 0 ? (
          <p className="empty">Every table already has row security.</p>
        ) : (
          <>
            <label className="field">
              <span className="field-label">Schema</span>
              <select
                value={schema}
                onChange={(event) => {
                  setSchema(event.target.value);
                  setTable("");
                }}
              >
                {schemas.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Table</span>
              <select value={chosen} onChange={(event) => setTable(event.target.value)}>
                {tableNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={model.editing.busy || schemas.length === 0}
          >
            Add row security
          </button>
        </div>
      </form>
    </Modal>
  );
}
