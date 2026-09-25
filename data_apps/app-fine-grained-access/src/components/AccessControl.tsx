import type { Mark } from "../lib/access";
import type { Editing } from "../lib/nodes";
import { AccessMark } from "./AccessMark";

type AccessControlProps = {
  mark: Mark; // what it will be once the queued changes run
  savedMark: Mark; // what it is in the database now
  tooltip: string;
  editing: Editing;
  onToggle: () => void;
  // What a click does, for the hover text: "on" when it turns access on, "off" when it turns it off.
  labels?: { on: string; off: string };
};

const GLYPHS: Record<Mark, string> = {
  direct: "✓",
  partial: "–",
  inherited: "",
  none: "",
};

// One place that decides whether an icon can be clicked.
// Square checkboxes are clickable. Circles are read-only: access that comes through another
// role, which you change on that role instead. Clicking queues a change; it doesn't run it.
// A dashed amber outline marks anything a queued change would alter.
export function AccessControl({
  mark,
  savedMark,
  tooltip,
  editing,
  onToggle,
  labels = { on: "grant access", off: "revoke access" },
}: AccessControlProps) {
  const pending = mark !== savedMark;

  if (mark === "inherited") {
    return <AccessMark mark={mark} tooltip={tooltip} pending={pending} />;
  }

  const hint = `Click to queue: ${mark === "direct" ? labels.off : labels.on}.`;
  const ariaChecked = mark === "direct" ? true : mark === "partial" ? "mixed" : false;

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={ariaChecked}
      aria-label={tooltip}
      title={`${tooltip}${pending ? " (pending)" : ""}. ${hint}`}
      className={`checkbox checkbox--${mark}${pending ? " checkbox--pending" : ""}`}
      disabled={editing.busy}
      onClick={onToggle}
    >
      {GLYPHS[mark]}
    </button>
  );
}
