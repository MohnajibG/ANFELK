import {
  BarChart3,
  Briefcase,
  CalendarDays,
  HelpCircle,
  ShieldCheck,
  User,
} from "lucide-react";

import GuideCard from "../../components/help/GuideCard";

const sections = [
  {
    icon: Briefcase,
    title: "Mes prestations",
    description:
      "La liste des prestations que vous pouvez réaliser, liées à votre spécialité.",
  },
  {
    icon: CalendarDays,
    title: "Mes rendez-vous",
    description:
      "Votre planning personnel. Une fois une prestation terminée, marquez-la comme telle : le rendez-vous passe alors en caisse pour l'encaissement.",
  },
  {
    icon: BarChart3,
    title: "Mes statistiques",
    description:
      "Votre activité mois par mois : nombre de prestations réalisées, chiffre d'affaires généré.",
  },
  {
    icon: User,
    title: "Mon profil",
    description: "Vos informations personnelles et le changement de mot de passe.",
  },
];

const EmployeeHelp = () => (
  <div className="w-full space-y-6">
    <section className="flex items-center gap-4 rounded-3xl border border-(--role-shell-border) bg-(--role-shell-bg) p-6 text-(--role-shell-text) shadow-(--shadow-sm)">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--role-shell-accent) text-(--role-shell-accent-text)">
        <HelpCircle size={24} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-(--role-shell-accent)">
          Guide
        </p>

        <h1 className="mt-2 font-title text-3xl font-bold">
          Mode d'emploi — Employé
        </h1>

        <p className="mt-2 text-sm text-(--role-shell-text)/60">
          Ce que vous pouvez faire dans chaque section, et comment vous en
          servir au quotidien.
        </p>
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
        <li>Ne partagez jamais votre mot de passe, même avec un collègue.</li>
        <li>
          Si vous avez reçu un mot de passe temporaire, il ne fonctionne
          qu'une seule fois : dès votre première connexion, l'application vous
          demandera d'en choisir un nouveau, personnel.
        </li>
      </ul>
    </section>
  </div>
);

export default EmployeeHelp;
