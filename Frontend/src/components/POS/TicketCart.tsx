import { Receipt, Trash2 } from "lucide-react";

import type { CartItem } from "../../hooks/usePOS";

type Props = {
  cart: CartItem[];
  removeItem: (index: number) => void;
  updatePrice: (index: number, price: number) => void;
};

const TicketCart = ({ cart, removeItem, updatePrice }: Props) => {
  return (
    <section className="rounded-3xl border border-(--border) bg-white p-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Ticket</h2>
        <Receipt />
      </div>

      <div className="mt-5 space-y-3">
        {!cart.length && (
          <p className="text-sm text-(--muted)">Aucun service ajouté</p>
        )}

        {cart.map((item, index) => (
          <div
            key={`${item.service._id}-${index}`}
            className="flex items-center gap-3 rounded-2xl border border-(--border) p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{item.service.name}</p>
              <p className="text-xs text-(--muted)">{item.duration} min</p>
            </div>

            <input
              type="number"
              min="0"
              value={item.finalPrice}
              onChange={(e) => updatePrice(index, Number(e.target.value))}
              className="w-20 shrink-0 rounded-xl border border-(--border) p-2 text-right outline-none"
            />

            <button
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Retirer ${item.service.name} du panier`}
              className="shrink-0 text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TicketCart;
