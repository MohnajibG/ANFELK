import type { ComponentType, ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

type AlertVariant = "danger" | "warning" | "success" | "info";

const variants: Record<
  AlertVariant,
  { icon: ComponentType<{ size?: number; className?: string }>; classes: string; iconClass: string }
> = {
  danger: {
    icon: AlertCircle,
    classes: "border-red-200 bg-red-50 text-red-700",
    iconClass: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    iconClass: "text-amber-600",
  },
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    iconClass: "text-emerald-600",
  },
  info: {
    icon: Info,
    classes: "border-blue-200 bg-blue-50 text-blue-700",
    iconClass: "text-blue-600",
  },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
}

/**
 * Bannière d'alerte réutilisable (erreur de chargement, avertissement,
 * confirmation, info) — remplace les encadrés bg-red-50/bg-green-50
 * réinventés dans chaque page.
 */
const Alert = ({
  variant = "danger",
  title,
  children,
  action,
  onDismiss,
}: AlertProps) => {
  const { icon: Icon, classes, iconClass } = variants[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${classes}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconClass}`} />

      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-1" : ""}>{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Fermer"
          className="shrink-0 rounded-lg p-1 transition hover:bg-black/5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
