
import { DashboardHeader } from "@/components/broker/dashboard/dashboard-header";

export function MetricsHeader() {
  return (
    <DashboardHeader
      title="Desempenho"
      description="Acompanhe seus indicadores de performance e métricas de vendas"
      buttonLabel="Exportar Relatório"
      onButtonClick={() => console.log("Export report clicked")}
    />
  );
}
