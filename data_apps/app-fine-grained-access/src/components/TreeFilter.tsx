// A text box that narrows the tree to matching schemas and tables.
export function TreeFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="search"
      className="filter"
      value={value}
      placeholder="Filter schemas and tables"
      aria-label="Filter schemas and tables"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
