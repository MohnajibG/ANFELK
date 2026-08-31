/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, HandCoins, Scissors, TrendingUp, Users } from "lucide-react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import { getEmployeeDashboard, type EmployeeDashboardData } from "../../api/dashboard.api";
import type { Employee } from "../../types/employee";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import LoadingState from "../../components/ui/LoadingState";
import Badge from "../../components/ui/Badge";

const formatDA = (value: number) => `${value.toLocaleString("fr-FR")} DA`;

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [dashboard, setDashboard] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [profile, dashboardData] = await Promise.all([
        getMyEmployeeProfile(),
        getEmployeeDashboard(),
      ]);
      setEmployee(profile);
      setDashboard(dashboardData);
    } catch (err) {
      console.error("Erreur chargement tableau de bord employé", err);
      setError("Impossible de charger votre espace");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingState label="Chargement de votre espace..." />;

  if (error || !employee || !dashboard) {
    return (
      <div className="rounded-2xl bg-red-50 p-5 text-red-600">
        {error || "Profil introuvable"}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Espace employé"
        title={`Bonjour ${employee.firstName}`}
        description={employee.speciality ?? "Employé"}
        icon={<Scissors size={24} />}
      />

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={HandCoins}
            title="Chiffre du jour"
            value={formatDA(dashboard.salesToday.revenue)}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Scissors}
            title="Prestations du jour"
            value={dashboard.salesToday.tickets}
            accent="gold"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={Users}
            title="Clients reçus ce mois"
            value={dashboard.clientsServedMonth}
            accent="info"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <StatCard
            icon={TrendingUp}
            title="Chiffre du mois"
            value={formatDA(dashboard.salesMonth.revenue)}
            accent="success"
          />
        </div>
      </section>

      <section className="flex flex-wrap gap-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-md border border-(--border) bg-white p-6 shadow-(--shadow-sm) sm:p-6 lg:w-[calc(66.667%-8px)]"
        >
          <div className="mb-4 flex items-center gap-2">
            <CalendarCheck size={20} className="text-(--brown)" />
            <h2 className="font-semibold text-(--black)">
              Prestations réalisées ce mois
            </h2>
          </div>

          {dashboard.servicesDoneMonth.length === 0 ? (
            <div className="rounded-2xl border border-(--border) bg-(--surface) p-5 text-sm text-(--muted)">
              Aucune prestation ce mois-ci
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {dashboard.servicesDoneMonth.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between rounded-2xl border border-(--border) bg-(--surface) p-4"
                >
                  <span className="text-sm font-medium text-(--black)">
                    {service._id}
                  </span>
                  <span className="text-sm font-semibold text-(--brown)">
                    {service.count} fois
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-md border border-(--border) bg-white shadow-(--shadow-sm) p-5 sm:p-6 lg:w-[calc(33.333%-16px)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-(--black)">Ma spécialité</h2>
            <Badge variant={employee.isActive ? "success" : "danger"}>
              {employee.isActive ? "Actif" : "Inactif"}
            </Badge>
          </div>

          <div className="space-y-4">
            <Info label="Spécialité" value={employee.speciality ?? "-"} />
            <Info
              label="Nom complet"
              value={`${employee.firstName} ${employee.lastName}`}
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-(--muted)">{label}</p>
    <p className="font-semibold text-(--black)">{value}</p>
  </div>
);

export default EmployeeDashboard;
