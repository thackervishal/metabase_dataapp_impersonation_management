import type { ReactNode } from "react";

import { sameNode } from "../lib/nodes";
import type { Node } from "../lib/nodes";
import { DatabaseIcon, SchemaIcon, TableIcon } from "./Icons";

type SchemaTreeProps = {
  databaseName: string;
  tables: Record<string, string[]>; // schema -> table names
  expanded: Set<string>; // schemas whose tables are showing
  onToggle: (schema: string) => void;
  filter: string; // narrows the tree; empty shows everything
  // Highlight and click to select. Leave both out for a tree you only read.
  selected?: Node;
  onSelect?: (node: Node) => void;
  // An icon shown at the right end of a row, for example who can read it.
  renderMark?: (node: Node) => ReactNode;
  // A line under every row. Turn on where a row can run wide enough that it's hard to tell
  // one from the next, for example a mark on every row.
  dividers?: boolean;
};

const INDENT = 20; // pixels per level

// The schemas and tables that match the filter. A schema whose own name matches
// keeps all its tables; otherwise only the matching tables stay.
function applyFilter(
  tables: Record<string, string[]>,
  filter: string,
): [string, string[]][] {
  const text = filter.trim().toLowerCase();
  const entries = Object.entries(tables);
  if (text === "") {
    return entries;
  }
  return entries.flatMap(([schema, names]): [string, string[]][] => {
    if (schema.toLowerCase().includes(text)) {
      return [[schema, names]];
    }
    const matches = names.filter((name) => name.toLowerCase().includes(text));
    return matches.length > 0 ? [[schema, matches]] : [];
  });
}

export function SchemaTree({
  databaseName,
  tables,
  expanded,
  onToggle,
  filter,
  selected,
  onSelect,
  renderMark,
  dividers,
}: SchemaTreeProps) {
  const filtering = filter.trim() !== "";
  const visible = applyFilter(tables, filter);

  // One row: [indent] [chevron slot] [icon + name] [mark].
  const row = (
    node: Node,
    depth: number,
    icon: ReactNode,
    name: string,
    chevron?: ReactNode,
  ) => {
    const active = selected !== undefined && sameNode(selected, node);
    const content = (
      <>
        {icon}
        <span className="row-label">{name}</span>
      </>
    );
    return (
      <div className={`tree-row${dividers ? " tree-row--divided" : ""}`}>
        <span style={{ width: depth * INDENT, flexShrink: 0 }} />
        {chevron ?? <span style={{ width: 22, flexShrink: 0 }} />}
        {onSelect ? (
          <button
            type="button"
            className={`row${active ? " row--active" : ""}`}
            onClick={() => onSelect(node)}
          >
            {content}
          </button>
        ) : (
          <div className="row">{content}</div>
        )}
        {renderMark && <span className="mark-cell">{renderMark(node)}</span>}
      </div>
    );
  };

  return (
    <div>
      {row({ level: "database" }, 0, <DatabaseIcon />, databaseName)}

      {filtering && visible.length === 0 && (
        <p className="empty">No schemas or tables match.</p>
      )}

      {visible.map(([schema, names]) => {
        // While filtering, open every schema that has a match so the match shows.
        const open = filtering || expanded.has(schema);
        const schemaNode: Node = { level: "schema", schema };
        const chevron = (
          <button
            type="button"
            className="chevron"
            aria-label={open ? `Collapse ${schema}` : `Expand ${schema}`}
            onClick={() => onToggle(schema)}
          >
            {open ? "▾" : "▸"}
          </button>
        );
        return (
          <div key={schema}>
            {row(schemaNode, 1, <SchemaIcon />, schema, chevron)}
            {open &&
              names.map((table) => {
                const node: Node = { level: "table", schema, table };
                return (
                  <div key={table}>{row(node, 2, <TableIcon />, table)}</div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
