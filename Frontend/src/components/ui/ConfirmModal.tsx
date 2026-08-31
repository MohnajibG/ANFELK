import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                danger ? "bg-red-50 text-red-600" : "bg-(--cream) text-(--brown)"
              }`}
            >
              <AlertTriangle size={22} />
            </div>
            <h2 className="font-title text-xl font-bold text-(--black)">
              {title}
            </h2>
          </div>

          <button
            onClick={onCancel}
            aria-label="Fermer"
            className="shrink-0 rounded-xl border border-(--border) p-2 hover:bg-(--cream)"
          >
            <X size={18} />
          </button>
        </div>

        {description && (
          <p className="mt-4 text-sm text-(--muted)">{description}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-2xl border border-(--border) py-3 transition hover:bg-(--cream) disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            aria-label={confirmLabel}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-(--black) hover:bg-(--brown-dark)"
            }`}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
