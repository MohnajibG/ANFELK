import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

interface AppointmentReasonModalProps {
  open: boolean;
  title: string;
  description?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const AppointmentReasonModal = ({
  open,
  title,
  description,
  reasonLabel = "Motif (optionnel)",
  reasonPlaceholder,
  confirmLabel = "Confirmer",
  loading = false,
  onConfirm,
  onCancel,
}: AppointmentReasonModalProps) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={22} />
            </div>
            <h2 className="font-title text-xl font-bold text-(--black)">
              {title}
            </h2>
          </div>

          <button
            onClick={onCancel}
            aria-label="Fermer"
            className="shrink-0 rounded-full border border-(--border) p-2 hover:bg-(--cream)"
          >
            <X size={18} />
          </button>
        </div>

        {description && (
          <p className="mt-4 text-sm text-(--muted)">{description}</p>
        )}

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium">
            {reasonLabel}
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={reasonPlaceholder}
            className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4 text-sm outline-none focus:ring-2 focus:ring-(--brown)/20"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-2xl border border-(--border) py-3 transition hover:bg-(--cream) disabled:opacity-50"
          >
            Fermer
          </button>

          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            disabled={loading}
            aria-label={confirmLabel}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 p-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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

export default AppointmentReasonModal;
