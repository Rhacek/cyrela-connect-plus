
import { Target } from "@/types";

export const mockTarget: Target = {
  id: "target1",
  brokerId: "broker1",
  month: 5,
  year: 2024,
  shareTarget: 2600,
  leadTarget: 104,
  scheduleTarget: 8,
  visitTarget: 4,
  saleTarget: 1
};

// Monthly targets for the current year
export const mockMonthlyTargets = [
  { month: "Janeiro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Fevereiro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Março", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Abril", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Maio", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Junho", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Julho", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Agosto", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Setembro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Outubro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Novembro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 },
  { month: "Dezembro", shareTarget: 2600, leadTarget: 104, scheduleTarget: 8, visitTarget: 4, saleTarget: 1 }
];
