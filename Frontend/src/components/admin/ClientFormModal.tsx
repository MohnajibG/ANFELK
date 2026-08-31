import { useState } from "react";

import { X, UserPlus, Pencil, Loader2 } from "lucide-react";
import { AxiosError } from "axios";

import { createClient, updateClient } from "../../api/client.api";

interface ClientToEdit {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

interface Props {
  open: boolean;
  client?: ClientToEdit | null;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  gender: "",
  birthDate: "",
  notes: "",
};

const ClientFormModal = ({ open, client, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() =>
    client
      ? {
          ...emptyForm,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          email: client.email ?? "",
        }
      : emptyForm,
  );

  const isEditing = Boolean(client);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isEditing && client) {
        await updateClient(client._id, form);
      } else {
        await createClient(form);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;

      setError(
        message ??
          `Erreur lors de ${isEditing ? "la modification" : "la création"} de la cliente`,
      );
    } finally {
      setLoading(false);
    }
  };

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

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            CRM
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            {isEditing ? "Modifier la cliente" : "Ajouter une cliente"}
          </h2>

          <p className="mt-2 text-sm text-(--muted)">
            {isEditing
              ? "Mettre à jour la fiche cliente"
              : "Créer une nouvelle fiche cliente"}
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
              className="h-11 rounded-2xl border border-(--border) bg-(--cream) px-4 outline-none focus:ring-2 focus:ring-(--brown)/20 sm:flex-1"
            />

            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
              className="h-11 rounded-2xl border border-(--border) bg-(--cream) px-4 outline-none focus:ring-2 focus:ring-(--brown)/20 sm:flex-1"
            />
          </div>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Téléphone"
            required
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          />

          {!isEditing && (
            <>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
              >
                <option value="">Genre</option>
                <option value="female">Femme</option>
                <option value="male">Homme</option>
              </select>

              <input
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleChange}
                className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
              />

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Remarques..."
                rows={3}
                className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4"
              />
            </>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--black) py-3 font-semibold text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : isEditing ? (
              <>
                <Pencil size={18} />
                Enregistrer les modifications
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Créer la cliente
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientFormModal;
