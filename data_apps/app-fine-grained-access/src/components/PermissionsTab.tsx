import { useState } from "react";

import { describeAccess } from "../lib/access";
import { DATABASE_NODE, accessAt } from "../lib/nodes";
import type { Model, Node } from "../lib/nodes";
import { AccessControl } from "./AccessControl";
import { AccessPanel } from "./AccessPanel";
import { RoleList } from "./RoleList";
import { RoleName } from "./RoleName";
import { SchemaTree } from "./SchemaTree";
import { Segmented } from "./Tabs";
import { TreeFilter } from "./TreeFilter";

type Perspective = "object" | "role";

const PERSPECTIVES: { value: Perspective; label: string }[] = [
  { value: "role", label: "By database role" },
  { value: "object", label: "By database object" },
];

// Two views of the same data. "By database role" comes first. "By database object": pick something in the tree, see every
// database role. "By database role": pick a database role, see the tree with what it can read.
export function PermissionsTab({ model }: { model: Model }) {
  const [perspective, setPerspective] = useState<Perspective>("role");
  const [node, setNode] = useState<Node>(DATABASE_NODE);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  // Schemas start collapsed, so a long tree stays short until you open something.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  // If the selected role was deleted (or its creation discarded), fall back to the first.
  const role =
    (selectedRole && model.roles.some((r) => r.name === selectedRole)
      ? selectedRole
      : null) ??
    model.roles[0]?.name ??
    null;
  const roleIsNew = model.roles.find((r) => r.name === role)?.pending;

  const toggle = (schema: string) =>
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(schema)) {
        next.delete(schema);
      } else {
        next.add(schema);
      }
      return next;
    });

  // Selecting a schema or table opens its schema, so you can see what you picked.
  const select = (picked: Node) => {
    setNode(picked);
    if (picked.level !== "database") {
      setExpanded((previous) => new Set(previous).add(picked.schema));
    }
  };

  return (
    <div className="tab-content">
      <Segmented
        options={PERSPECTIVES}
        value={perspective}
        onChange={setPerspective}
      />

      {perspective === "object" ? (
        <div className="layout">
          <div className="card card--side">
            <TreeFilter value={filter} onChange={setFilter} />
            <SchemaTree
              databaseName={model.databaseName}
              tables={model.tables}
              expanded={expanded}
              onToggle={toggle}
              filter={filter}
              selected={node}
              onSelect={select}
            />
          </div>
          <div className="card card--main">
            <AccessPanel node={node} model={model} />
          </div>
        </div>
      ) : (
        <div className="layout">
          <div className="card card--side">
            <RoleList
              roles={model.roles}
              selected={role}
              onSelect={setSelectedRole}
            />
          </div>
          <div className="card card--main">
            {role && (
              <>
                <h2>
                  <RoleName name={role} isNew={roleIsNew} />
                </h2>
                <TreeFilter value={filter} onChange={setFilter} />
                <SchemaTree
                  databaseName={model.databaseName}
                  tables={model.tables}
                  expanded={expanded}
                  onToggle={toggle}
                  filter={filter}
                  renderMark={(treeNode) => {
                    const access = accessAt(role, treeNode, model);
                    const saved = accessAt(role, treeNode, model, "saved");
                    return (
                      <AccessControl
                        mark={access.mark}
                        savedMark={saved.mark}
                        tooltip={describeAccess(
                          access,
                          treeNode.level !== "table",
                        )}
                        editing={model.editing}
                        onToggle={() =>
                          model.editing.stageGrant(
                            role,
                            treeNode,
                            access.mark !== "direct",
                          )
                        }
                      />
                    );
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
