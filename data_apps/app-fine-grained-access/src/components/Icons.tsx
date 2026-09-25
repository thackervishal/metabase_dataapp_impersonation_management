// Small line icons for the tree. They inherit the surrounding text color.

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  style: { flexShrink: 0 },
};

export function DatabaseIcon() {
  return (
    <svg {...base}>
      <ellipse cx="8" cy="3.5" rx="5.5" ry="2" />
      <path d="M2.5 3.5v9c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-9" />
      <path d="M2.5 8c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2" />
    </svg>
  );
}

export function SchemaIcon() {
  return (
    <svg {...base}>
      <path d="M1.5 4.5a1 1 0 0 1 1-1h3.2l1.4 1.5h5.4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1z" />
    </svg>
  );
}

export function TableIcon() {
  return (
    <svg {...base}>
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
      <path d="M1.5 6.5h13M6 6.5v7" />
    </svg>
  );
}
