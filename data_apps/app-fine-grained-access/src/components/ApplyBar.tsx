import { describeChange } from "../lib/changes";
import type { Editing } from "../lib/nodes";
import { describeValues } from "../lib/policies";

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
        {editing.removedPolicies.length > 0 && (
          <div className="apply-note">
            This also removes {editing.removedPolicies.length} row{" "}
            {editing.removedPolicies.length === 1 ? "policy" : "policies"}, because their database role
            is being deleted or no longer has access to the table:
            <ul className="plain-list">
              {editing.removedPolicies.map((policy) => (
                <li key={policy.name}>
                  {policy.role} on {policy.schema}.{policy.table} where {policy.column} is one of:{" "}
                  {describeValues(policy.values)}
                </li>
              ))}
            </ul>
          </div>
        )}
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
