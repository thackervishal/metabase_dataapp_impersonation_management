import { useState } from "react";

import type { Role } from "../lib/access";
import type { Model } from "../lib/nodes";
import { AddRoleModal } from "./AddRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleName } from "./RoleName";

// One panel: a kind of database role, its list, and a Delete button on each.
function RolePanel({
  title,
  roles,
  model,
  onDelete,
}: {
  title: string;
  roles: Role[];
  model: Model;
  onDelete: (role: Role) => void;
}) {
  return (
    <div className="card card--list">
      <h2>{title}</h2>
      {roles.length === 0 && <p className="empty">None yet.</p>}
      {roles.map((role) => (
        <div key={role.name} className="row">
          <RoleName name={role.name} isNew={role.pending} />
          <button
            type="button"
            className="btn btn--danger btn--small row-action"
            disabled={model.editing.busy}
            onClick={() => onDelete(role)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// Creating and deleting database roles. Functional and person database roles get their own
// panel, side by side, each with a Delete button on every row. "Add" opens a dialog. Both
// only queue a change.
export function ManageRolesTab({ model }: { model: Model }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Role | null>(null);

  const functional = model.roles.filter((role) => role.kind === "functional");
  const person = model.roles.filter((role) => role.kind === "person");
  // Every role this app manages is functional or person; this is only a defensive fallback.
  const other = model.roles.filter((role) => role.kind !== "functional" && role.kind !== "person");

  return (
    <div className="tab-content">
      <div className="tab-toolbar">
        <p className="tab-note">
          Every database role this app manages. Adding or deleting one is
          queued until you choose Apply.
        </p>
        <button
          type="button"
          className="btn btn--primary"
          disabled={model.editing.busy}
          onClick={() => setAdding(true)}
        >
          Add database role
        </button>
      </div>

      <div className="stack">
        <RolePanel
          title="Functional database roles"
          roles={functional}
          model={model}
          onDelete={setDeleting}
        />
        <RolePanel
          title="Person database roles"
          roles={person}
          model={model}
          onDelete={setDeleting}
        />
      </div>

      {other.length > 0 && (
        <div className="card card--auto card--spaced">
          <h2>Other database roles</h2>
          <p className="tab-note">
            These don&apos;t match either prefix. That shouldn&apos;t happen through this app.
          </p>
          {other.map((role) => (
            <div key={role.name} className="row">
              <RoleName name={role.name} isNew={role.pending} />
              <button
                type="button"
                className="btn btn--danger btn--small row-action"
                disabled={model.editing.busy}
                onClick={() => setDeleting(role)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {adding && <AddRoleModal model={model} onClose={() => setAdding(false)} />}
      {deleting && (
        <DeleteRoleModal
          model={model}
          role={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
