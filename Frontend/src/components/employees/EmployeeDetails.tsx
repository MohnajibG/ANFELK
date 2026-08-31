import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  Scissors,
  CalendarDays,
  Wallet,
  TrendingUp,
  Users,
  Receipt,
  Clock,
} from "lucide-react";

import { getEmployeeById } from "../../api/employee.api";
import {
  getEmployeeStats,
  type EmployeeDetailStats,
} from "../../api/dashboard.api";

import Alert from "../ui/Alert";
import LoadingState from "../ui/LoadingState";

import type { Employee } from "../../types/employee";

type Period = "day" | "week" | "month";

const PERIOD_LABELS: Record<Period, string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  in_progress: "En cours",
  completed: "Terminé",
  waiting_payment: "Paiement attendu",
  paid: "Payé",
  cancelled: "Annulé",
  no_show: "Absent",
};

const moneyFormat = new Intl.NumberFormat("fr-FR");

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [period, setPeriod] = useState<Period>("month");
  const [stats, setStats] = useState<EmployeeDetailStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await getEmployeeById(id);

        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Employé introuvable");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const loadStats = useCallback(async () => {
    if (!id) return;

    try {
      setStatsLoading(true);
      setStatsError("");

      const data = await getEmployeeStats(id, { period });

      setStats(data);
    } catch (err) {
      setStatsError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les statistiques",
      );
    } finally {
      setStatsLoading(false);
    }
  }, [id, period]);

  useEffect(() => {
    const timer = setTimeout(loadStats, 0);
    return () => clearTimeout(timer);
  }, [loadStats]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-(--border) bg-white p-10">
        <LoadingState label="Chargement du profil..." />
      </div>
    );
  }

  if (error || !employee) {
    return <Alert variant="danger">{error || "Employé introuvable"}</Alert>;
  }

  const maxEvolution = Math.max(
    1,
    ...(stats?.evolution.map((point) => point.revenue) ?? [1]),
  );

  return (
    <div className="w-full space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 rounded-xl border border-(--border) bg-white px-4 py-3 text-sm"
      >
        <ArrowLeft size={18} />
        Retour
      </button>

      {/* PROFIL */}

      <section className="flex flex-col gap-8 rounded-3xl border border-(--border) bg-white p-6 lg:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-full bg-(--cream) font-title text-4xl font-bold text-(--brown)">
            {employee.firstName?.charAt(0)}
            {employee.lastName?.charAt(0)}
          </div>

          <span
            className={`mt-5 rounded-full px-4 py-2 text-sm font-semibold ${
              employee.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {employee.isActive ? "Actif" : "Inactif"}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.35em] text-(--brown)">
            Profil employé
          </p>

          <h1 className="mt-3 font-title text-4xl font-bold">
            {employee.firstName} {employee.lastName}
          </h1>

          <p className="mt-2 text-(--muted)">
            {employee.role === "employee" ? "Employé" : "Caissier"}
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Phone size={18} />}
                label="Téléphone"
                value={employee.phone || "Non renseigné"}
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Mail size={18} />}
                label="Email"
                value={employee.email}
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<Scissors size={18} />}
                label="Spécialité"
                value={employee.speciality || "Non définie"}
              />
            </div>

            <div className="w-full sm:w-[calc(50%-12px)]">
              <Info
                icon={<CalendarDays size={18} />}
                label="Création compte"
                value={
                  employee.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString()
                    : "-"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* SELECTEUR PERIODE */}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Statistiques</h2>

        <div className="flex rounded-xl border border-(--border) bg-white p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={`rounded-lg px-4 py-2 text-sm transition ${
                period === key
                  ? "bg-(--black) text-(--cream)"
                  : "text-(--muted)"
              }`}
            >
              {PERIOD_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {statsError && <Alert variant="danger">{statsError}</Alert>}

      {statsLoading || !stats ? (
        <div className="rounded-3xl border border-(--border) bg-white p-10">
          <LoadingState />
        </div>
      ) : (
        <>
          {/* STATS */}

          <section className="flex flex-wrap gap-4">
            <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
              <Card
                title="Chiffre généré"
                value={`${moneyFormat.format(stats.revenue.current)} DA`}
                change={stats.revenue.change}
                icon={<Wallet />}
              />
            </div>

            <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
              <Card
                title="Prestations"
                value={String(stats.tickets.current)}
                change={stats.tickets.change}
                icon={<Receipt />}
              />
            </div>

            <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
              <Card
                title="Panier moyen"
                value={`${moneyFormat.format(stats.averageBasket)} DA`}
                icon={<TrendingUp />}
              />
            </div>

            <div className="w-full *:h-full md:w-[calc(50%-8px)] xl:w-[calc(25%-12px)]">
              <Card
                title="Clientes servies"
                value={String(stats.clientsServed)}
                icon={<Users />}
              />
            </div>
          </section>

          {/* PERFORMANCE */}

          <section className="flex flex-wrap gap-6">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(66.667%-8px)]"
            >
              <h2 className="mb-6 text-xl font-semibold">
                Évolution du chiffre d'affaires
              </h2>

              {stats.evolution.length === 0 ? (
                <p className="flex h-64 items-center justify-center rounded-3xl bg-(--cream) text-sm text-(--muted)">
                  Aucune vente sur cette période
                </p>
              ) : (
                <div className="flex h-64 items-end gap-2 rounded-3xl bg-(--cream) p-6">
                  {stats.evolution.map((point) => (
                    <div
                      key={point._id}
                      title={`${point._id} · ${moneyFormat.format(point.revenue)} DA`}
                      className="flex-1 rounded-full bg-(--brown)"
                      style={{
                        height: `${Math.max(4, (point.revenue / maxEvolution) * 100)}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <div className="w-full rounded-3xl border border-(--border) bg-white p-6 lg:w-[calc(33.333%-16px)]">
              <h2 className="mb-5 text-xl font-semibold">Prestations réalisées</h2>

              {stats.servicesBreakdown.length === 0 ? (
                <p className="text-sm text-(--muted)">
                  Aucune prestation sur cette période
                </p>
              ) : (
                <div className="space-y-4">
                  {stats.servicesBreakdown.map((service) => (
                    <Stat
                      key={service._id}
                      icon={<Scissors />}
                      title={service._id}
                      value={`${service.count} fois`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* PLANNING */}

          <section className="rounded-3xl border border-(--border) bg-white p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Planning — prochains rendez-vous
            </h2>

            {stats.upcomingAppointments.length === 0 ? (
              <p className="text-sm text-(--muted)">
                Aucun rendez-vous à venir
              </p>
            ) : (
              <div className="space-y-4">
                {stats.upcomingAppointments.map((appointment) => {
                  const client =
                    typeof appointment.client === "string"
                      ? ""
                      : `${appointment.client.firstName} ${appointment.client.lastName}`;

                  return (
                    <motion.div
                      key={appointment._id}
                      whileHover={{ x: 5 }}
                      className="flex flex-col gap-3 rounded-2xl border border-(--border) bg-(--surface) p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{client}</p>

                        <p className="text-sm text-(--muted)">
                          {appointment.services
                            .map((service) => service.name)
                            .join(", ")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-(--muted)">
                          {statusLabels[appointment.status] ??
                            appointment.status}
                        </span>

                        <div className="flex items-center gap-2 text-sm text-(--muted)">
                          <Clock size={14} />
                          {appointment.date.slice(0, 10)} ·{" "}
                          {appointment.startTime}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

const Card = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-3xl border border-(--border) bg-white p-6"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-(--muted)">{title}</p>

          <h3 className="mt-2 text-3xl font-bold">{value}</h3>

          {change !== undefined && (
            <p
              className={`mt-1 text-xs font-semibold ${
                change >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}% vs période précédente
            </p>
          )}
        </div>

        <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>
      </div>
    </motion.div>
  );
};

const Info = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{label}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

const Stat = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-(--surface) p-4">
      <div className="rounded-xl bg-(--cream) p-3 text-(--brown)">{icon}</div>

      <div>
        <p className="text-sm text-(--muted)">{title}</p>

        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default EmployeeDetails;
