import { describeAccess, roleGroups } from "../lib/access";
import { accessAt, nodeTitle } from "../lib/nodes";
import type { Model, Node } from "../lib/nodes";
import { AccessControl } from "./AccessControl";
import { DatabaseIcon, SchemaIcon, TableIcon } from "./Icons";
import { RoleName } from "./RoleName";

const ICONS = {
  database: <DatabaseIcon />,
  schema: <SchemaIcon />,
  table: <TableIcon />,
};

// The right side of "By database object": for the selected node, every database role with
// an icon that shows whether it can read it. Hover an icon for the details. Clicking a
// checkbox queues a grant or a revoke.
export function AccessPanel({ node, model }: { node: Node; model: Model }) {
  const isGroup = node.level !== "table";

  return (
    <div>
      <h2>
        {ICONS[node.level]}
        {nodeTitle(node, model)}
      </h2>

      {roleGroups(model.roles).map((group) => (
        <section key={group.title}>
          <div className="section-title">{group.title}</div>
          {group.roles.map((role) => {
            const access = accessAt(role.name, node, model);
            const saved = accessAt(role.name, node, model, "saved");
            return (
              <div key={role.name} className="row">
                <AccessControl
                  mark={access.mark}
                  savedMark={saved.mark}
                  tooltip={describeAccess(access, isGroup)}
                  editing={model.editing}
                  onToggle={() =>
                    model.editing.stageGrant(role.name, node, access.mark !== "direct")
                  }
                />
                <RoleName name={role.name} isNew={role.pending} />
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
