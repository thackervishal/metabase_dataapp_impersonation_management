import { describeWire } from "../lib/batch";
import type { BatchRecord } from "../lib/batch";

// The database's own record of the latest save: what was asked, the SQL it ran, and whether
// it was verified. It's read from the database on every load, so it survives a page reload.
export function LastSave({ batch }: { batch: BatchRecord | null }) {
  if (!batch) {
    return null;
  }

  const applied = batch.status === "applied";
  const when = new Date(batch.requestedAt).toLocaleString();
  const count = batch.outcomes.length;

  return (
    <details className="last-save">
      <summary>
        Last save: {applied ? "applied and verified" : "failed, nothing changed"}
        {" · "}
        {when}
        {applied && ` · ${count} ${count === 1 ? "change" : "changes"}`}
      </summary>

      {!applied && batch.errorMessage && (
        <p className="error">{batch.errorMessage}</p>
      )}

      <ol className="pending-list">
        {batch.outcomes.map((outcome) => (
          <li key={outcome.index}>
            <div>
              <div>
                {describeWire(outcome.change)}
                <span className={`status status--${outcome.status}`}>
                  {outcome.status === "rolled_back" ? "rolled back" : outcome.status}
                </span>
              </div>
              {outcome.sql.map((statement) => (
                <code key={statement} className="sql">
                  {statement}
                </code>
              ))}
              {outcome.error && <div className="error">{outcome.error}</div>}
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}
