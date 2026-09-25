import { useState } from "react";

import { countChanges } from "../lib/batch";
import type { BatchRecord } from "../lib/batch";
import { BatchDetails } from "./BatchDetails";

// Every save the database has recorded, newest first. Each row opens to show what was
// changed and the exact SQL that ran. This is the database's own record, so it can't
// drift from what actually happened.
export function AuditTab({ batches }: { batches: BatchRecord[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  return (
    <div className="tab-content">
      <div className="tab-toolbar">
        <p className="tab-note">
          Every save, newest first. Open one to see the changes and the SQL the database ran.
          {batches.length === 100 && " Showing the latest 100."}
        </p>
      </div>

      <div className="card card--list">
        {batches.length === 0 && <p className="empty">Nothing has been saved yet.</p>}
        {batches.map((batch) => {
          const isOpen = open.has(batch.id);
          const count = countChanges(batch.changes);
          return (
            <div key={batch.id} className="audit-row">
              <button
                type="button"
                className="audit-summary"
                aria-expanded={isOpen}
                onClick={() => toggle(batch.id)}
              >
                <span className="audit-caret">{isOpen ? "▾" : "▸"}</span>
                <span className="audit-when">
                  {new Date(batch.requestedAt).toLocaleString()}
                </span>
                <span className={`status status--${batch.status}`}>{batch.status}</span>
                <span className="audit-count">
                  {count} {count === 1 ? "change" : "changes"}
                </span>
                {batch.status !== "applied" && batch.errorMessage && (
                  <span className="audit-error">{batch.errorMessage}</span>
                )}
              </button>
              {isOpen && <BatchDetails batch={batch} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
