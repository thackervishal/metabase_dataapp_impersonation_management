import type { Mark } from "../lib/access";

// One icon per state. They're circles, not boxes, so they don't look clickable.
// direct: solid brand check. inherited: grey ring with a check (comes from another role).
// partial: half-filled ring (some tables). none: empty ring.
// `tooltip` is the hover text; it carries the role names and counts.
// `pending` outlines the icon when a queued change would alter it.
// Colors are CSS variables from app.css, so the icons follow light and dark mode.
export function AccessMark({
  mark,
  tooltip,
  pending = false,
}: {
  mark: Mark;
  tooltip: string;
  pending?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label={tooltip}
      title={tooltip}
      className={pending ? "mark mark--pending" : "mark"}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        {mark === "direct" && (
          <>
            <circle cx="9" cy="9" r="8" style={{ fill: "var(--brand)" }} />
            <path
              d="M5.2 9.3l2.6 2.6 5-5.4"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {mark === "inherited" && (
          <>
            <circle
              cx="9"
              cy="9"
              r="7.2"
              strokeWidth="1.5"
              style={{ fill: "var(--bg-subtle)", stroke: "var(--text-3)" }}
            />
            <path
              d="M5.4 9.3l2.4 2.4 4.8-5.1"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ stroke: "var(--text-2)" }}
            />
          </>
        )}
        {mark === "partial" && (
          <>
            <circle
              cx="9"
              cy="9"
              r="7.2"
              strokeWidth="1.5"
              style={{ fill: "var(--bg-card)", stroke: "var(--brand)" }}
            />
            <path d="M9 1.8a7.2 7.2 0 0 0 0 14.4z" style={{ fill: "var(--brand)" }} />
          </>
        )}
        {mark === "none" && (
          <circle
            cx="9"
            cy="9"
            r="7.2"
            strokeWidth="1.5"
            style={{ fill: "none", stroke: "var(--border)" }}
          />
        )}
      </svg>
    </span>
  );
}
