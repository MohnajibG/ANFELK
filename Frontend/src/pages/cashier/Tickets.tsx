import { useState } from "react";
import { Eye, Search, Receipt, XCircle } from "lucide-react";

import useTickets from "../../hooks/useTickets";

import ViewTicketModal from "../../components/ticket/ViewTicketModal";
import ConfirmModal from "../../components/ui/ConfirmModal";

import type { TicketStatus } from "../../types/ticket";

const statusLabels: Record<TicketStatus, string> = {
  waiting_payment: "En attente de paiement",
  paid: "Payé",
  cancelled: "Annulé",
};

const CashierTickets = () => {
  const {
    filteredTickets,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    selectedTicket,
    setSelectedTicket,
    handleCancel,
  } = useTickets();

  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const confirmCancel = async () => {
    if (!cancelTarget) return;

    try {
      setCancelling(true);
      await handleCancel(cancelTarget);
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center text-(--muted)">
        Chargement des tickets...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <section className="flex flex-col gap-3 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <p className="ak-kicker">Caisse</p>

        <h1 className="font-title text-3xl font-bold">Historique tickets</h1>

        <p className="ak-muted">Consultez les ventes réalisées.</p>
      </section>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-600">{error}</div>
      )}

      <section className="flex flex-col gap-4 rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) md:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-(--border) bg-(--cream) p-3">
          <Search size={18} className="text-(--champagne)" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher ticket ou cliente..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | TicketStatus)}
          className="rounded-xl border border-(--border) p-3"
        >
          <option value="all">Tous</option>

          <option value="paid">Payés</option>

          <option value="cancelled">Annulés</option>
        </select>
      </section>

      <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        {!filteredTickets.length && (
          <p className="text-center text-(--muted)">Aucun ticket trouvé</p>
        )}

        <div className="flex flex-col gap-4">
          {filteredTickets.map((ticket) => {
            const client =
              typeof ticket.client === "object"
                ? `${ticket.client.firstName} ${ticket.client.lastName}`
                : "Client";

            return (
              <article
                key={ticket._id}
                className="flex flex-col gap-4 rounded-2xl bg-(--surface) p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Receipt size={18} />

                    <strong>{ticket.ticketNumber}</strong>
                  </div>

                  <span className="text-sm">{client}</span>

                  <span className="text-xs text-(--muted)">
                    {ticket.items.length} prestation(s)
                  </span>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <strong className="text-xl text-(--black)">
                    {ticket.total.toLocaleString("fr-FR")} DA
                  </strong>

                  <span className="rounded-full bg-white px-3 py-1 text-xs">
                    {statusLabels[ticket.status]}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTicket(ticket)}
                    aria-label="Voir le ticket"
                    className="rounded-xl bg-(--black) p-3 text-(--cream)"
                  >
                    <Eye size={18} />
                  </button>

                  {ticket.status === "paid" && (
                    <button
                      onClick={() => setCancelTarget(ticket._id)}
                      aria-label="Annuler le ticket"
                      className="rounded-xl bg-red-100 p-3 text-red-600"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {selectedTicket && (
        <ViewTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Annuler ce ticket ?"
        description="Le ticket sera marqué comme annulé et retiré du chiffre d'affaires."
        confirmLabel="Annuler le ticket"
        loading={cancelling}
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default CashierTickets;
