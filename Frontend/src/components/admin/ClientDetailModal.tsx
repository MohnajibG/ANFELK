import { X, Phone, Mail, Calendar, Wallet, CalendarClock } from "lucide-react";

import ClientReliabilityBadge from "../clients/ClientReliabilityBadge";

interface ClientDetail {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  visitCount: number;
  noShowCount: number;
  attendedCount: number;
  totalSpent: number;
  lastVisit?: string;
}

interface Props {
  open: boolean;
  client: ClientDetail | null;
  onClose: () => void;
}

const ClientDetailModal = ({ open, client, onClose }: Props) => {
  if (!open || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--black) text-lg font-bold text-(--champagne)">
            {client.firstName?.charAt(0)}
            {client.lastName?.charAt(0)}
          </div>

          <div>
            <h2 className="font-title text-2xl font-bold text-(--black)">
              {client.firstName} {client.lastName}
            </h2>

            <ClientReliabilityBadge client={client} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Row icon={Phone} label="Téléphone" value={client.phone} />
          <Row
            icon={Mail}
            label="Email"
            value={client.email || "Non renseigné"}
          />
          <Row
            icon={Calendar}
            label="Visites"
            value={`${client.visitCount} (${client.attendedCount} honorées, ${client.noShowCount} absence${client.noShowCount > 1 ? "s" : ""})`}
          />
          <Row
            icon={Wallet}
            label="Total dépensé"
            value={`${client.totalSpent.toLocaleString("fr-FR")} DA`}
          />
          <Row
            icon={CalendarClock}
            label="Dernière visite"
            value={
              client.lastVisit
                ? new Date(client.lastVisit).toLocaleDateString("fr-FR")
                : "-"
            }
          />
        </div>
      </div>
    </div>
  );
};

const Row = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 rounded-2xl bg-(--surface) p-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--black) text-(--champagne)">
      <Icon size={18} />
    </div>

    <div>
      <p className="text-xs text-(--muted)">{label}</p>
      <p className="font-medium text-(--black)">{value}</p>
    </div>
  </div>
);

export default ClientDetailModal;
