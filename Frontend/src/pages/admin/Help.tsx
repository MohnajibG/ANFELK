import {
  CalendarDays,
  HelpCircle,
  Layers,
  ListTodo,
  Receipt,
  Scissors,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import GuideCard from "../../components/help/GuideCard";

const sections = [
  {
    icon: Users,
    title: "Clients",
    description:
      "La fiche de chaque client : coordonnées, historique. Créez, modifiez ou désactivez une fiche depuis cet écran.",
  },
  {
    icon: UserCog,
    title: "Employés",
    description:
      "Créez les comptes employé et caissier de votre équipe, gérez leurs horaires hebdomadaires et leurs congés (exceptions), activez ou désactivez un compte.",
    tips: [
      "À la création d'un compte, un mot de passe temporaire s'affiche une seule fois dans une fenêtre — copiez-le et transmettez-le à la personne, l'appli ne l'envoie pas automatiquement.",
      "La personne devra obligatoirement choisir son propre mot de passe dès sa première connexion.",
    ],
  },
  {
    icon: Layers,
    title: "Catégories",
    description:
      "Les familles de prestations (ex : Épilation, Soin visage...). À créer avant d'ajouter des services, pour les organiser.",
  },
  {
    icon: Scissors,
    title: "Services",
    description:
      "Les prestations proposées au salon : nom, prix, durée, spécialité, catégorie. C'est la base utilisée pour la prise de rendez-vous et l'encaissement.",
  },
  {
    icon: CalendarDays,
    title: "Rendez-vous",
    description:
      "Le calendrier du salon : création (simple ou récurrente), modification, déplacement par glisser-déposer, annulation.",
  },
  {
    icon: ListTodo,
    title: "Liste d'attente",
    description:
      "Les clients en attente d'un créneau quand rien n'est disponible. Dès qu'un créneau se libère, vous pouvez le convertir directement en rendez-vous.",
  },
  {
    icon: Receipt,
    title: "Tickets",
    description:
      "L'historique de toutes les ventes encaissées, qu'elles viennent de la caisse ou d'une prestation terminée.",
  },
  {
    icon: Wallet,
    title: "Caisses",
    description:
      "L'historique des sessions de caisse ouvertes et fermées par vos caissiers : montant d'ouverture, de fermeture, écarts constatés.",
    tips: [
      "Une caisse restée ouverte trop longtemps se ferme automatiquement au bout d'un moment, pour éviter les oublis.",
    ],
  },
  {
    icon: Settings,
    title: "Paramètres",
    description: "Vos informations personnelles et le changement de mot de passe.",
  },
];

const AdminHelp = () => (
  <div className="w-full space-y-6">
    <PageHeader
      kicker="Guide"
      title="Mode d'emploi — Administrateur"
      description="Ce que vous pouvez faire dans chaque section de l'application, et comment vous en servir au quotidien."
      icon={<HelpCircle size={24} />}
    />

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
          En tant qu'administrateur, vous êtes le seul rôle à pouvoir créer et
          désactiver des comptes — évitez de partager votre mot de passe, même
          avec votre équipe.
        </li>
        <li>
          Un mot de passe temporaire donné à un employé ne fonctionne qu'une
          seule fois : dès la première connexion, la personne doit en choisir
          un nouveau.
        </li>
        <li>
          Après plusieurs tentatives de connexion échouées, un compte est
          bloqué automatiquement pendant 15 minutes, pour se protéger contre
          les essais répétés.
        </li>
      </ul>
    </section>
  </div>
);

export default AdminHelp;
