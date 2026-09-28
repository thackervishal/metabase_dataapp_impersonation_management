import { countChanges } from "../lib/batch";
import type { BatchRecord } from "../lib/batch";
import { BatchDetails } from "./BatchDetails";

// The result of the save you just made, with the SQL the database ran. It appears only
// after you press Apply, and goes away when you dismiss it. Every past save is in the
// Audit History tab.
export function SaveResult({
  batch,
  onDismiss,
}: {
  batch: BatchRecord;
  onDismiss: () => void;
}) {
  const applied = batch.status === "applied";
  const count = countChanges(batch.changes);

  return (
    <details className="last-save" open>
      <summary>
        {applied ? "Saved" : "Not saved"}
        {" · "}
        {count} {count === 1 ? "change" : "changes"}
        {!applied && ", nothing was changed"}
      </summary>
      <button type="button" className="link last-save-dismiss" onClick={onDismiss}>
        Dismiss
      </button>
      <BatchDetails batch={batch} />
    </details>
  );
}
