import api from "./axios";

export type DashboardPeriod = "day" | "week" | "month" | "year" | "custom";

export interface DashboardFilters {
  period: DashboardPeriod;
  date?: string;
  startDate?: string;
  endDate?: string;
}

interface SalesBlock {
  revenue: number;
  tickets: number;
}

export interface DashboardData {
  range: {
    start: string;
    end: string;
  };

  sales: {
    current: SalesBlock;
    previous: SalesBlock;
    change: {
      revenue: number;
      tickets: number;
    };
  };

  averageBasket: number;

  clients: {
    total: number;
    new: number;
    returning: number;
  };

  employees: {
    total: number;
  };

  popularServices: {
    _id: string;
    sales: number;
    revenue: number;
  }[];

  topEmployees: {
    employeeId: string;
    name: string;
    revenue: number;
    tickets: number;
  }[];

  topCashiers: {
    userId: string;
    name: string;
    revenue: number;
    tickets: number;
  }[];

  paymentBreakdown: {
    _id: string;
    revenue: number;
    tickets: number;
  }[];

  categoryBreakdown: {
    _id: string;
    name: string;
    revenue: number;
    sales: number;
  }[];

  cancellation: {
    totalTickets: number;
    cancelledCount: number;
    cancelledValue: number;
    rate: number;
  };

  appointments: {
    total: number;
    completed: number;
    cancelled: number;
    noShow: number;
    conversionRate: number;
    noShowRate: number;
  };

  evolution: {
    _id: string;
    revenue: number;
    tickets: number;
  }[];

  expenses?: {
    total: number;
    breakdown: {
      _id: "variable" | "semi-variable";
      total: number;
      count: number;
    }[];
    evolution: {
      _id: string;
      total: number;
    }[];
  };
}

export const getAdminDashboard = async (
  filters: DashboardFilters,
): Promise<DashboardData> => {
  const response = await api.get("/dashboard", {
    params: filters,
  });

  return response.data.dashboard;
};

interface EmployeeSalesBlock {
  revenue: number;
  tickets: number;
}

export interface EmployeeDashboardData {
  salesToday: EmployeeSalesBlock;
  salesMonth: EmployeeSalesBlock;
  clientsServedMonth: number;
  servicesDoneMonth: { _id: string; count: number }[];
  evolution: { _id: string; revenue: number }[];
}

export const getEmployeeDashboard = async (
  date?: string,
): Promise<EmployeeDashboardData> => {
  const response = await api.get("/dashboard", {
    params: date ? { date } : undefined,
  });

  return response.data.dashboard;
};

interface EmployeeStatsSalesBlock {
  current: number;
  previous: number;
  change: number;
}

export interface EmployeeAppointmentSummary {
  _id: string;
  date: string;
  startTime: string;
  status: string;
  services: { name: string; price: number }[];
  client:
    | string
    | { _id: string; firstName: string; lastName: string; phone?: string };
}

export interface EmployeeDetailStats {
  range: { start: string; end: string };
  revenue: EmployeeStatsSalesBlock;
  tickets: EmployeeStatsSalesBlock;
  averageBasket: number;
  clientsServed: number;
  servicesBreakdown: { _id: string; count: number; revenue: number }[];
  evolution: { _id: string; revenue: number }[];
  appointmentsInRange: number;
  upcomingAppointments: EmployeeAppointmentSummary[];
}

export const getEmployeeStats = async (
  employeeId: string,
  filters: Pick<DashboardFilters, "period" | "date">,
): Promise<EmployeeDetailStats> => {
  const response = await api.get(`/dashboard/employee/${employeeId}`, {
    params: filters,
  });

  return response.data.stats;
};
