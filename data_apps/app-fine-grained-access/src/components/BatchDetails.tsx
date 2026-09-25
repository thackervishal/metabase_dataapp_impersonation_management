import { describeWire, parseOutcomes } from "../lib/batch";
import type { BatchRecord } from "../lib/batch";

// What the database recorded for one save: each change, whether it was applied, and the exact
// SQL it ran. For a failed save, the changes before the failure are marked rolled back.
export function BatchDetails({ batch }: { batch: BatchRecord }) {
  const outcomes = parseOutcomes(batch.results);

  return (
    <div>
      {batch.status !== "applied" && batch.errorMessage && (
        <p className="error">{batch.errorMessage}</p>
      )}
      {outcomes.length === 0 && (
        <p className="empty">The database recorded no details for this save.</p>
      )}
      <ol className="pending-list">
        {outcomes.map((outcome) => (
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
    </div>
  );
}
