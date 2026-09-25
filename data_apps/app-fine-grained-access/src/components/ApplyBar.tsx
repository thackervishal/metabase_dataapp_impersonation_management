import { describeChange } from "../lib/changes";
import type { Editing } from "../lib/nodes";

// Shows the queued changes and the buttons that run or throw them away.
// It only appears when something is queued, and stays at the bottom of the window.
export function ApplyBar({
  editing,
  databaseName,
}: {
  editing: Editing;
  databaseName: string;
}) {
  const count = editing.pending.length;
  if (count === 0) {
    return null;
  }

  return (
    <div className="apply-bar" role="region" aria-label="Pending changes">
      <details className="apply-details">
        <summary>
          {count} pending {count === 1 ? "change" : "changes"}
        </summary>
        <ol className="pending-list">
          {editing.pending.map((change, index) => (
            <li key={`${index}-${describeChange(change, databaseName)}`}>
              <span>{describeChange(change, databaseName)}</span>
              <button
                type="button"
                className="link"
                disabled={editing.busy}
                onClick={() => editing.removePending(index)}
              >
                Remove
              </button>
            </li>
          ))}
        </ol>
      </details>

      <div className="apply-actions">
        <button
          type="button"
          className="btn"
          disabled={editing.busy}
          onClick={editing.discard}
        >
          Discard
        </button>
        <button
          type="button"
          className="btn btn--primary"
          disabled={editing.busy}
          onClick={editing.apply}
        >
          {editing.busy ? "Applying…" : `Apply ${count === 1 ? "change" : "changes"}`}
        </button>
      </div>
    </div>
  );
}
