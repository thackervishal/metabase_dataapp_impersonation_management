import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// A dialog on top of the page. Escape closes it, and so does a click on the dim area around it.
// The Escape key is handled on the dialog itself, not on the whole document, because the
// sandbox the app runs in blocks document-wide keyboard listeners. Focus starts inside the
// dialog so that key handler receives the key.
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialog.current?.focus();
  }, []);

  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialog}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="link"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
