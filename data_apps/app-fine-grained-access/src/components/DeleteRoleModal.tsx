import { useState } from "react";

import type { Role } from "../lib/access";
import type { Model } from "../lib/nodes";
import { Modal } from "./Modal";
import { RoleName } from "./RoleName";

// A warning about what deleting a database role also affects, and a box where you type the
// role's name to confirm. Confirming queues the deletion; nothing happens until Apply.
export function DeleteRoleModal({
  model,
  role,
  onClose,
}: {
  model: Model;
  role: Role;
  onClose: () => void;
}) {
  const [confirmation, setConfirmation] = useState("");
  const confirmed = confirmation.trim() === role.name;

  // Who is affected, as it will be once the queued changes have run.
  const isFunctional = role.kind === "functional";
  const affected = isFunctional
    ? model.mappings.membersOf(role.name)
    : model.mappings.rolesOf(role.name);

  const submit = () => {
    if (!confirmed) {
      return;
    }
    model.editing.stageDeleteRole(role.name);
    onClose();
  };

  return (
    <Modal title="Delete a database role" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="warning" role="alert">
          <p>
            <strong>
              <RoleName name={role.name} isNew={role.pending} />
            </strong>{" "}
            will be deleted, along with everything it can read.
          </p>
          {isFunctional ? (
            <>
              <p>
                {affected.length > 0
                  ? "These person database roles will be removed from it, and will lose any access they get through it:"
                  : "No person database roles are in it."}
              </p>
              <PeopleList names={affected} />
            </>
          ) : (
            <>
              <p>
                {affected.length > 0
                  ? "It will be removed from these functional database roles:"
                  : "It isn't in any functional database role."}
              </p>
              <PeopleList names={affected} />
            </>
          )}
        </div>

        <label className="field">
          <span className="field-label">Type the name to confirm</span>
          <span className="input-group">
            <input
              type="text"
              value={confirmation}
              placeholder={role.name}
              autoComplete="off"
              autoFocus
              onChange={(event) => setConfirmation(event.target.value)}
            />
          </span>
          <span className="hint">
            Type <strong>{role.name}</strong> exactly to enable the button.
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
            Delete database role
          </button>
        </div>
      </form>
    </Modal>
  );
}

function PeopleList({ names }: { names: string[] }) {
  if (names.length === 0) {
    return null;
  }
  return (
    <ul className="plain-list">
      {names.map((name) => (
        <li key={name}>
          <RoleName name={name} />
        </li>
      ))}
    </ul>
  );
}
