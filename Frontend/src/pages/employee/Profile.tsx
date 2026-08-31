import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  Scissors,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import { getEmployeeDashboard } from "../../api/dashboard.api";

import LoadingState from "../../components/ui/LoadingState";
import ChangePasswordModal from "../../components/settings/ChangePasswordModal";

import type { Employee } from "../../types/employee";

const Profile = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [servicesDone, setServicesDone] = useState<number | null>(null);
  const [revenueMonth, setRevenueMonth] = useState<number | null>(null);
  const [clientsReceived, setClientsReceived] = useState<number | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyEmployeeProfile();

        setEmployee(data);
      } catch (error) {
        console.error("Erreur chargement profil", error);
      }
    };

    const loadStats = async () => {
      try {
        const dashboard = await getEmployeeDashboard();

        setServicesDone(
          dashboard.servicesDoneMonth.reduce(
            (total, service) => total + service.count,
            0,
          ),
        );
        setRevenueMonth(dashboard.salesMonth.revenue);
        setClientsReceived(dashboard.clientsServedMonth);
      } catch (error) {
        console.error("Erreur chargement statistiques profil", error);
      }
    };

    loadProfile();
    loadStats();
  }, []);

  if (!employee) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <LoadingState label="Chargement du profil..." />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="rounded-3xl border border-(--border) bg-white p-8 shadow-(--shadow-sm)"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-(--black) text-(--cream)">
            <User size={55} />
          </div>

          <div>
            <p className="ak-kicker">Profil employé</p>

            <h1 className="mt-2 font-title text-3xl font-bold">
              {employee.firstName} {employee.lastName}
            </h1>

            <p className="ak-muted mt-2">
              {employee.role === "employee" ? "Employé" : "Caissier"}

              {" · "}

              {employee.speciality ?? "-"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <CheckCircle size={16} />

              {employee.isActive ? "Actif" : "Inactif"}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QUICK STATS */}

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard
            title="Prestations réalisées"
            value={servicesDone !== null ? String(servicesDone) : "-"}
          />
        </div>

        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard
            title="Chiffre du mois"
            value={
              revenueMonth !== null
                ? `${revenueMonth.toLocaleString("fr-FR")} DA`
                : "-"
            }
          />
        </div>

        <div className="w-full md:w-[calc(33.333%-10.667px)]">
          <StatCard
            title="Clients reçus"
            value={clientsReceived !== null ? String(clientsReceived) : "-"}
          />
        </div>
      </div>

      {/* INFORMATIONS */}

      <div className="flex flex-col gap-5 lg:flex-row">
        <motion.div
          className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:flex-1"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">Informations personnelles</h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Mail size={18} />}
              label="Email"
              value={employee.email}
            />

            <Info
              icon={<Phone size={18} />}
              label="Téléphone"
              value={employee.phone || "-"}
            />

            <Info
              icon={<CalendarDays size={18} />}
              label="Création du compte"
              value={
                employee.createdAt
                  ? new Date(employee.createdAt).toLocaleDateString("fr-FR")
                  : "-"
              }
            />
          </div>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:flex-1"
          whileHover={{
            scale: 1.01,
          }}
        >
          <h2 className="mb-5 text-lg font-bold">
            Informations professionnelles
          </h2>

          <div className="space-y-4 text-sm">
            <Info
              icon={<Scissors size={18} />}
              label="Spécialité"
              value={employee.speciality ?? "-"}
            />

            <Info
              icon={<CheckCircle size={18} />}
              label="Statut du compte"
              value={employee.isActive ? "Actif" : "Inactif"}
            />
          </div>
        </motion.div>
      </div>

      {/* SECURITE */}

      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <h2 className="text-lg font-bold">Sécurité</h2>

        <p className="ak-muted mt-2 text-sm">Gestion du mot de passe du compte.</p>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="mt-5 rounded-xl bg-(--black) px-6 py-3 font-semibold text-(--cream) transition hover:bg-(--brown-dark)"
        >
          Modifier le mot de passe
        </button>
      </div>

      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <motion.div
    whileHover={{
      y: -4,
    }}
    className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)"
  >
    <p className="ak-muted text-sm">{title}</p>

    <h2 className="mt-2 text-3xl font-bold">{value}</h2>
  </motion.div>
);

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="rounded-xl bg-(--cream) p-3 text-(--black)">{icon}</div>

    <div>
      <p className="ak-muted text-xs">{label}</p>

      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

export default Profile;
