import {
  CalendarDays,
  HelpCircle,
  ListTodo,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Users,
} from "lucide-react";

import GuideCard from "../../components/help/GuideCard";

const sections = [
  {
    icon: ShoppingCart,
    title: "Point de vente",
    description:
      "L'écran d'encaissement du salon : ouvrez votre caisse en début de service, encaissez les ventes et prestations, fermez-la en fin de service.",
    tips: [
      "Vous devez ouvrir votre caisse (montant de départ) avant de pouvoir encaisser quoi que ce soit.",
      "Pensez à fermer votre caisse à la fin de votre service — comptez votre tiroir, un écart éventuel est noté automatiquement.",
    ],
  },
  {
    icon: Users,
    title: "Clients",
    description:
      "Consultez ou créez une fiche client (coordonnées, historique).",
  },
  {
    icon: CalendarDays,
    title: "Rendez-vous",
    description:
      "Consultez et créez des rendez-vous. Une fois la prestation terminée par l'employé, le rendez-vous passe automatiquement en attente de paiement dans votre caisse.",
  },
  {
    icon: ListTodo,
    title: "Liste d'attente",
    description:
      "Ajoutez un client en attente d'un créneau, et convertissez-le en rendez-vous dès qu'une place se libère.",
  },
  {
    icon: Receipt,
    title: "Tickets",
    description: "L'historique des tickets que vous avez émis.",
  },
  {
    icon: UserRound,
    title: "Profil",
    description: "Vos informations personnelles et le changement de mot de passe.",
  },
];

const CashierHelp = () => (
  <div className="w-full space-y-6">
    <section className="flex flex-col gap-5 rounded-3xl border border-(--border) bg-(--black) p-6 text-(--cream) shadow-(--shadow-sm) sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-(--champagne)">
          Guide
        </p>

        <h1 className="mt-3 font-title text-3xl font-bold">
          Mode d'emploi — Caissier
        </h1>

        <p className="mt-2 text-sm text-(--cream)/60">
          Ce que vous pouvez faire dans chaque section, et comment vous en
          servir au quotidien.
        </p>
      </div>

      <div className="rounded-xl bg-white/10 p-3">
        <HelpCircle size={28} />
      </div>
    </section>

    <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
      <h2 className="mb-5 text-lg font-bold text-(--black)">Vos outils</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <GuideCard key={section.title} {...section} />
        ))}
      </div>
    </section>

    <section className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--black) text-(--champagne)">
          <ShieldCheck size={18} />
        </div>

        <h2 className="text-lg font-bold text-(--black)">Sécurité</h2>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-(--muted)">
        <li>
          Ne partagez jamais votre mot de passe, même avec un collègue —
          chaque action en caisse est associée à votre compte.
        </li>
        <li>
          Si vous avez reçu un mot de passe temporaire, il ne fonctionne
          qu'une seule fois : dès votre première connexion, choisissez votre
          propre mot de passe.
        </li>
        <li>
          Pensez à vous déconnecter si vous partagez un poste avec un
          collègue.
        </li>
      </ul>
    </section>
  </div>
);

export default CashierHelp;
