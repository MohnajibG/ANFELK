import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion } from "framer-motion";

import type { Service } from "../../types/service";
import type { Employee } from "../../types/employee";

type Props = {
  services: Service[];
  employees: Employee[];
  search: string;
  setSearch: (value: string) => void;
  addService: (service: Service) => void;
};

const ServiceSelector = ({
  services,
  employees,
  search,
  setSearch,
  addService,
}: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const groupedServices = useMemo(() => {
    const groups = new Map<string, Service[]>();

    for (const service of services) {
      const categoryName = service.category?.name ?? "Autres";
      const group = groups.get(categoryName) ?? [];
      group.push(service);
      groups.set(categoryName, group);
    }

    return Array.from(groups.entries());
  }, [services]);

  const hasEligibleEmployee = (service: Service) =>
    employees.some((employee) => employee.speciality === service.speciality);

  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-(--border) p-3">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une prestation..."
            className="w-full outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-(--border) px-4 py-3 text-sm font-medium transition hover:bg-(--cream)"
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {collapsed ? "Afficher" : "Réduire"}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-5 space-y-5">
          {groupedServices.map(([categoryName, groupServices]) => (
            <div key={categoryName}>
              <h3 className="mb-3 text-l font-bold uppercase tracking-[0.2em] text-(--muted)">
                {categoryName}
              </h3>

              <div className="flex flex-wrap gap-3">
                {groupServices.map((service) => {
                  const disabled = !hasEligibleEmployee(service);

                  return (
                    <motion.button
                      key={service._id}
                      type="button"
                      disabled={disabled}
                      whileHover={disabled ? undefined : { y: -3 }}
                      whileTap={disabled ? undefined : { scale: 0.97 }}
                      onClick={() => !disabled && addService(service)}
                      className={`w-full rounded-xl border p-3 text-left transition sm:w-[calc(50%-6px)] lg:w-[calc(33.333%-8px)] ${
                        disabled
                          ? "cursor-not-allowed border-(--border) bg-stone-100 opacity-60"
                          : "border-(--border) hover:border-(--black) hover:bg-(--cream)"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {service.name}
                          </p>

                          <p className="text-xs text-(--muted)">
                            {service.duration} min
                          </p>

                          {disabled && (
                            <p className="mt-1 text-xs text-red-600">
                              Aucun employé actif disponible
                            </p>
                          )}
                        </div>

                        <strong className="shrink-0 text-sm">
                          {service.price} DA
                        </strong>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          {!groupedServices.length && (
            <p className="text-sm text-(--muted)">Aucune prestation trouvée</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ServiceSelector;
