import { describeFields, parseOutcomes } from "../lib/batch";
import { describeValues } from "../lib/policies";
import type { BatchRecord, Outcome } from "../lib/batch";

// What the database recorded for one save: each change as labelled fields, whether it was
// applied, and the exact SQL it ran. For a failed save, the changes before the failure are
// marked rolled back.
// Changes that can delete row policies as a side effect say how many, counted from the
// statements the database ran.
function removedPolicies(outcome: Outcome): [string, string][] {
  const kind = outcome.change?.kind;
  if (kind !== "dropRole" && kind !== "disableRls" && kind !== "pruneOrphanPolicies") {
    return [];
  }
  // Older saves have no details, so fall back to counting the statements.
  const count =
    outcome.removedPolicies.length ||
    outcome.sql.filter((statement) => statement.startsWith("drop policy")).length;
  return [["Row policies removed", String(count)]];
}

export function BatchDetails({ batch }: { batch: BatchRecord }) {
  const outcomes = parseOutcomes(batch.results);

  return (
    <div className="batch-details">
      {batch.status !== "applied" && batch.errorMessage && (
        <p className="error">{batch.errorMessage}</p>
      )}
      {outcomes.length === 0 && (
        <p className="empty">The database recorded no details for this save.</p>
      )}
      {outcomes.map((outcome) => (
        <div key={outcome.index} className="batch-change">
          <span className={`status status--${outcome.status}`}>
            {outcome.status === "rolled_back" ? "rolled back" : outcome.status}
          </span>
          <dl className="batch-fields">
            {[...describeFields(outcome.change), ...removedPolicies(outcome)].map(([label, value]) => (
              <div key={label}>
                <dt>{label}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          {outcome.removedPolicies.length > 0 && (
            <ul className="removed-policies">
              {outcome.removedPolicies.map((policy) => (
                <li key={policy.policy}>
                  <strong>{policy.role}</strong> on {policy.schema}.{policy.table} where{" "}
                  {policy.column} is one of: {describeValues(policy.values)}
                </li>
              ))}
            </ul>
          )}
          {outcome.sql.length > 0 && (
            <pre className="sql-block">
              <code>{outcome.sql.map((statement) => `${statement};`).join("\n")}</code>
            </pre>
          )}
          {outcome.error && <div className="error">{outcome.error}</div>}
        </div>
      ))}
    </div>
  );
}
