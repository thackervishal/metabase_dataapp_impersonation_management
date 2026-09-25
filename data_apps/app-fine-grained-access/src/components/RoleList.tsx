import { roleGroups } from "../lib/access";
import type { Role } from "../lib/access";
import { RoleName } from "./RoleName";

type RoleListProps = {
  roles: Role[];
  selected: string | null;
  onSelect: (name: string) => void;
};

// A clickable list of database roles, grouped as functional and person.
export function RoleList({ roles, selected, onSelect }: RoleListProps) {
  return (
    <div>
      {roleGroups(roles).map((group) => (
        <section key={group.title}>
          <div className="section-title">{group.title}</div>
          {group.roles.map((role) => (
            <button
              key={role.name}
              type="button"
              className={`row${role.name === selected ? " row--active" : ""}`}
              onClick={() => onSelect(role.name)}
            >
              <RoleName name={role.name} isNew={role.pending} />
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}
