import { useState } from "react";

import { MAX_ROLE_NAME_LENGTH, ROLE_PREFIX } from "../lib/access";
import type { RoleKind } from "../lib/changes";
import type { Model } from "../lib/nodes";
import { Modal } from "./Modal";

const NAME_PATTERN = /^[a-z][a-z0-9_]*$/;

// Why a name can't be used, or null if it's fine. The limit counts the prefix,
// because the prefix is part of the name Postgres sees.
function checkName(name: string, kind: RoleKind, existing: Set<string>): string | null {
  const prefix = ROLE_PREFIX[kind];
  const maxLength = MAX_ROLE_NAME_LENGTH - prefix.length;
  if (name === "") {
    return "Enter a name.";
  }
  if (!NAME_PATTERN.test(name)) {
    return "Use lowercase letters, numbers, and underscores, starting with a letter.";
  }
  if (name.length > maxLength) {
    return `Use at most ${maxLength} characters. With the ${prefix} prefix, the full name can't be longer than ${MAX_ROLE_NAME_LENGTH}.`;
  }
  if (existing.has(prefix + name)) {
    return `${prefix}${name} already exists.`;
  }
  return null;
}

// The details needed to create a database role. Adding queues the change; nothing
// happens in the database until Apply.
export function AddRoleModal({
  model,
  onClose,
}: {
  model: Model;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<RoleKind>("functional");
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);

  const prefix = ROLE_PREFIX[kind];
  const maxLength = MAX_ROLE_NAME_LENGTH - prefix.length;
  const existing = new Set(model.roles.map((role) => role.name));
  const problem = checkName(name, kind, existing);

  const submit = () => {
    if (problem) {
      setShowError(true);
      return;
    }
    model.editing.stageCreateRole(name, kind);
    onClose();
  };

  return (
    <Modal title="Add a database role" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <fieldset className="field">
          <legend>Kind</legend>
          <label className="choice">
            <input
              type="radio"
              name="role-kind"
              checked={kind === "functional"}
              onChange={() => {
                setKind("functional");
                setShowError(false);
              }}
            />
            Functional database role
          </label>
          <label className="choice">
            <input
              type="radio"
              name="role-kind"
              checked={kind === "person"}
              onChange={() => {
                setKind("person");
                setShowError(false);
              }}
            />
            Person database role
          </label>
        </fieldset>

        <label className="field">
          <span className="field-label">Name</span>
          <span className="input-group">
            <span className="prefix">{prefix}</span>
            <input
              type="text"
              value={name}
              maxLength={maxLength}
              placeholder={kind === "person" ? "grace" : "operations"}
              autoComplete="off"
              autoFocus
              onChange={(event) => {
                setName(event.target.value.toLowerCase());
                setShowError(false);
              }}
            />
          </span>
          <span className="hint">
            The app adds {prefix} for you. Type only the name you want, up to{" "}
            {maxLength} characters ({name.length} used).
          </span>
        </label>

        {showError && problem && <p className="error">{problem}</p>}

        <div className="modal-footer">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={model.editing.busy}
          >
            Add database role
          </button>
        </div>
      </form>
    </Modal>
  );
}
