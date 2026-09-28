import { useState } from "react";

import type { Role } from "../lib/access";
import type { Editing, Model } from "../lib/nodes";
import { AccessControl } from "./AccessControl";
import { RoleList } from "./RoleList";
import { RoleName } from "./RoleName";
import { Segmented } from "./Tabs";

type View = "role" | "person";

const VIEWS: { value: View; label: string }[] = [
  { value: "role", label: "By functional database role" },
  { value: "person", label: "By person database role" },
];

// Which person database roles belong to which functional database roles, in both directions.
// "By functional database role": pick one, see which person database roles are in it.
// "By person database role": pick one, see which functional database roles it belongs to.
// The checkboxes queue membership changes.
export function MappingsTab({ model }: { model: Model }) {
  const [view, setView] = useState<View>("role");
  const [functionalName, setFunctionalName] = useState<string | null>(null);
  const [personName, setPersonName] = useState<string | null>(null);

  const functional = model.roles.filter((role) => role.kind === "functional");
  const people = model.roles.filter((role) => role.kind === "person");

  // If the picked role is gone (deleted, or its creation discarded), fall back to the first.
  const firstOr = (list: Role[], picked: string | null) =>
    (picked && list.some((role) => role.name === picked) ? picked : null) ??
    list[0]?.name ??
    null;
  const pickedFunctional = firstOr(functional, functionalName);
  const pickedPerson = firstOr(people, personName);

  return (
    <div className="tab-content">
      <Segmented options={VIEWS} value={view} onChange={setView} />

      {view === "role" ? (
        <div className="layout">
          <div className="card card--side card--side-wide">
            <RoleList
              roles={functional}
              selected={pickedFunctional}
              onSelect={setFunctionalName}
            />
          </div>
          <div className="card card--main">
            {pickedFunctional && (
              <MembershipList
                title={pickedFunctional}
                heading="Person database roles"
                items={people}
                editing={model.editing}
                isMember={(person) =>
                  model.mappings.membersOf(pickedFunctional).includes(person)
                }
                wasMember={(person) =>
                  model.saved.mappings.membersOf(pickedFunctional).includes(person)
                }
                tooltip={(person, member) =>
                  member
                    ? `${person} is in ${pickedFunctional}`
                    : `${person} is not in ${pickedFunctional}`
                }
                onToggle={(person, member) =>
                  model.editing.stageMembership(person, pickedFunctional, !member)
                }
              />
            )}
          </div>
        </div>
      ) : (
        <div className="layout">
          <div className="card card--side card--side-wide">
            <RoleList
              roles={people}
              selected={pickedPerson}
              onSelect={setPersonName}
            />
          </div>
          <div className="card card--main">
            {pickedPerson && (
              <MembershipList
                title={pickedPerson}
                heading="Functional database roles"
                items={functional}
                editing={model.editing}
                isMember={(name) =>
                  model.mappings.rolesOf(pickedPerson).includes(name)
                }
                wasMember={(name) =>
                  model.saved.mappings.rolesOf(pickedPerson).includes(name)
                }
                tooltip={(name, member) =>
                  member
                    ? `${pickedPerson} is in ${name}`
                    : `${pickedPerson} is not in ${name}`
                }
                onToggle={(name, member) =>
                  model.editing.stageMembership(pickedPerson, name, !member)
                }
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

type MembershipListProps = {
  title: string;
  heading: string;
  items: Role[];
  editing: Editing;
  isMember: (name: string) => boolean; // once queued changes have run
  wasMember: (name: string) => boolean; // in the database now
  tooltip: (name: string, member: boolean) => string;
  onToggle: (name: string, member: boolean) => void;
};

function MembershipList({
  title,
  heading,
  items,
  editing,
  isMember,
  wasMember,
  tooltip,
  onToggle,
}: MembershipListProps) {
  return (
    <div>
      <h2>
        <RoleName name={title} />
      </h2>
      <div className="section-title">{heading}</div>
      {items.map((item) => {
        const member = isMember(item.name);
        return (
          <div key={item.name} className="row">
            <AccessControl
              mark={member ? "direct" : "none"}
              savedMark={wasMember(item.name) ? "direct" : "none"}
              tooltip={tooltip(item.name, member)}
              editing={editing}
              labels={{ on: "add to the role", off: "remove from the role" }}
              onToggle={() => onToggle(item.name, member)}
            />
            <RoleName name={item.name} isNew={item.pending} />
          </div>
        );
      })}
    </div>
  );
}
