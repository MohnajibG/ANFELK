/* eslint-disable react-hooks/set-state-in-effect */
import { motion } from "framer-motion";
import { HandCoins, Scissors, Users, TrendingUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { getMyEmployeeProfile } from "../../api/employee.api";
import { getEmployeeDashboard, type EmployeeDashboardData } from "../../api/dashboard.api";
import LoadingState from "../../components/ui/LoadingState";

import type { Employee } from "../../types/employee";

const formatDA = (value: number) => `${value.toLocaleString("fr-FR")} DA`;

const MyStatistics = () => {
  const { month } = useParams();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [dashboard, setDashboard] = useState<EmployeeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const currentMonth = month ?? new Date().toISOString().slice(0, 7);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [profile, dashboardData] = await Promise.all([
        getMyEmployeeProfile(),
        getEmployeeDashboard(`${currentMonth}-01`),
      ]);
      setEmployee(profile);
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Erreur statistiques employé", error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !employee || !dashboard) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
        <LoadingState />
      </div>
    );
  }

  const averageBasket =
    dashboard.salesMonth.tickets > 0
      ? Math.round(dashboard.salesMonth.revenue / dashboard.salesMonth.tickets)
      : 0;

  const bestService = dashboard.servicesDoneMonth[0]?._id ?? "-";

  const maxEvolutionRevenue = Math.max(
    1,
    ...dashboard.evolution.map((day) => day.revenue),
  );

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-(--border) bg-white px-5 py-7 shadow-(--shadow-sm) sm:px-8">
        <p className="ak-kicker">Statistiques employé</p>

        <h1 className="mt-3 font-title text-3xl font-bold">
          Performance de {employee.firstName}
        </h1>

        <p className="ak-muted mt-2">{employee.speciality ?? "Employé"}</p>

        <div className="mt-4 inline-flex rounded-xl bg-(--champagne)/20 px-4 py-2 text-sm font-semibold text-(--brown-dark)">
          {currentMonth}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard
            title="Chiffre d'affaires"
            value={formatDA(dashboard.salesMonth.revenue)}
            icon={HandCoins}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard
            title="Prestations réalisées"
            value={String(dashboard.salesMonth.tickets)}
            icon={Scissors}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard
            title="Clients reçus"
            value={String(dashboard.clientsServedMonth)}
            icon={Users}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
          <KpiCard
            title="Panier moyen"
            value={formatDA(averageBasket)}
            icon={TrendingUp}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:w-[calc(66.667%-8px)]"
        >
          <h2 className="mb-5 font-semibold">
            Évolution du chiffre d'affaires
          </h2>

          {dashboard.evolution.length === 0 ? (
            <div className="rounded-3xl bg-(--surface) p-5 text-sm text-(--muted)">
              Aucune vente ce mois-ci
            </div>
          ) : (
            <div className="flex h-64 items-end gap-1.5 rounded-3xl bg-(--surface) p-5">
              {dashboard.evolution.map((day) => (
                <div
                  key={day._id}
                  title={`${day._id} : ${formatDA(day.revenue)}`}
                  className="flex-1 rounded-full bg-(--black)"
                  style={{
                    height: `${Math.max(4, (day.revenue / maxEvolutionRevenue) * 100)}%`,
                  }}
                />
              ))}
            </div>
          )}

          <p className="ak-muted mt-4 text-sm">
            Chiffre d'affaires quotidien du mois sélectionné
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm) lg:w-[calc(33.333%-16px)]"
        >
          <h2 className="mb-5 font-semibold">Résumé mensuel</h2>

          <div className="space-y-4 text-sm">
            <p>
              Meilleure prestation :<b className="ml-1">{bestService}</b>
            </p>

            <p>
              Total tickets encaissés :
              <b className="ml-1">{dashboard.salesMonth.tickets}</b>
            </p>
          </div>
        </motion.div>

        <motion.div className="w-full rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)">
          <h2 className="mb-5 font-semibold">Prestations réalisées</h2>

          {dashboard.servicesDoneMonth.length === 0 ? (
            <div className="rounded-2xl bg-(--surface) p-5 text-sm text-(--muted)">
              Aucune donnée disponible
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {dashboard.servicesDoneMonth.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between rounded-2xl bg-(--surface) p-4 text-sm"
                >
                  <span className="font-medium text-(--black)">
                    {service._id}
                  </span>
                  <span className="font-semibold text-(--brown)">
                    {service.count} fois
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const KpiCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-3xl border border-(--border) bg-white p-6 shadow-(--shadow-sm)"
  >
    <div className="flex justify-between">
      <div>
        <p className="ak-muted text-sm">{title}</p>

        <h3 className="mt-2 text-2xl font-bold">{value}</h3>
      </div>

      <div className="rounded-full bg-(--cream) p-4">
        <Icon size={22} />
      </div>
    </div>
  </motion.div>
);

export default MyStatistics;
