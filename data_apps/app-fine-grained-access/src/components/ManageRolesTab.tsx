import { useState } from "react";

import { roleGroups } from "../lib/access";
import type { Role } from "../lib/access";
import type { Model } from "../lib/nodes";
import { AddRoleModal } from "./AddRoleModal";
import { DeleteRoleModal } from "./DeleteRoleModal";
import { RoleName } from "./RoleName";

// Creating and deleting database roles. The list shows every database role, grouped by kind,
// with a Delete button on each. "Add" opens a dialog. Both only queue a change.
export function ManageRolesTab({ model }: { model: Model }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Role | null>(null);

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

      <div className="card card--list">
        {model.roles.length === 0 && <p className="empty">No database roles yet.</p>}
        {roleGroups(model.roles).map((group) => (
          <section key={group.title}>
            <div className="section-title">{group.title}</div>
            {group.roles.map((role) => (
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
          </section>
        ))}
      </div>

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
