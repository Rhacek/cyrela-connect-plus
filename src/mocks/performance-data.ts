
import { Performance } from "@/types";

export const mockPerformance: Performance = {
  id: "perf1",
  brokerId: "broker1",
  month: 5,
  year: 2024,
  shares: 1500,
  leads: 45,
  schedules: 6,
  visits: 3,
  sales: 1
};

// Weekly performance data for charts
export const mockWeeklyPerformance = [
  { week: "Semana 1", shares: 350, leads: 8, schedules: 1, visits: 0, sales: 0 },
  { week: "Semana 2", shares: 420, leads: 12, schedules: 2, visits: 1, sales: 0 },
  { week: "Semana 3", shares: 380, leads: 10, schedules: 1, visits: 1, sales: 0 },
  { week: "Semana 4", shares: 350, leads: 15, schedules: 2, visits: 1, sales: 1 }
];

// Monthly performance data for charts
export const mockMonthlyPerformance = [
  { month: "Janeiro", shares: 1200, leads: 30, schedules: 4, visits: 2, sales: 0 },
  { month: "Fevereiro", shares: 1350, leads: 35, schedules: 5, visits: 2, sales: 1 },
  { month: "Março", shares: 1400, leads: 40, schedules: 5, visits: 3, sales: 1 },
  { month: "Abril", shares: 1450, leads: 42, schedules: 6, visits: 3, sales: 1 },
  { month: "Maio", shares: 1500, leads: 45, schedules: 6, visits: 3, sales: 1 }
];

// Historical performance data
export const mockHistoricalPerformance = [
  { year: 2023, month: 1, shares: 900, leads: 20, schedules: 3, visits: 1, sales: 0 },
  { year: 2023, month: 2, shares: 950, leads: 22, schedules: 3, visits: 1, sales: 0 },
  { year: 2023, month: 3, shares: 1000, leads: 25, schedules: 4, visits: 2, sales: 1 },
  { year: 2023, month: 4, shares: 1050, leads: 27, schedules: 4, visits: 2, sales: 0 },
  { year: 2023, month: 5, shares: 1100, leads: 30, schedules: 4, visits: 2, sales: 1 },
  { year: 2023, month: 6, shares: 1150, leads: 32, schedules: 5, visits: 2, sales: 0 },
  { year: 2023, month: 7, shares: 1200, leads: 35, schedules: 5, visits: 3, sales: 1 },
  { year: 2023, month: 8, shares: 1250, leads: 38, schedules: 5, visits: 3, sales: 1 },
  { year: 2023, month: 9, shares: 1300, leads: 40, schedules: 6, visits: 3, sales: 0 },
  { year: 2023, month: 10, shares: 1350, leads: 42, schedules: 6, visits: 3, sales: 1 },
  { year: 2023, month: 11, shares: 1400, leads: 45, schedules: 6, visits: 3, sales: 1 },
  { year: 2023, month: 12, shares: 1450, leads: 48, schedules: 7, visits: 4, sales: 1 },
  { year: 2024, month: 1, shares: 1200, leads: 30, schedules: 4, visits: 2, sales: 0 },
  { year: 2024, month: 2, shares: 1350, leads: 35, schedules: 5, visits: 2, sales: 1 },
  { year: 2024, month: 3, shares: 1400, leads: 40, schedules: 5, visits: 3, sales: 1 },
  { year: 2024, month: 4, shares: 1450, leads: 42, schedules: 6, visits: 3, sales: 1 },
  { year: 2024, month: 5, shares: 1500, leads: 45, schedules: 6, visits: 3, sales: 1 }
];
