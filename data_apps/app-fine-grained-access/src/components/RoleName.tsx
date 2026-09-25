import { prefixOf } from "../lib/access";

// The full role name, with the shared prefix dimmed so the part that differs stands out.
// The full name is what a Metabase user attribute must contain, so we never hide it.
// `isNew` adds a badge for a role that's queued to be created.
export function RoleName({ name, isNew = false }: { name: string; isNew?: boolean }) {
  const prefix = prefixOf(name);
  const label = prefix ? (
    <span className="row-label">
      <span className="prefix">{prefix}</span>
      {name.slice(prefix.length)}
    </span>
  ) : (
    <span className="row-label">{name}</span>
  );

  return (
    <>
      {label}
      {isNew && <span className="badge">new</span>}
    </>
  );
}
