
import { useState } from "react";
import { 
  Sidebar, 
  SidebarInset, 
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrokerSidebarContent } from "@/components/broker/sidebar/broker-sidebar-content";
import { MetricsHeader } from "@/components/broker/metrics/metrics-header";
import { MetricsFilter } from "@/components/broker/metrics/metrics-filter";
import { MetricsOverview } from "@/components/broker/metrics/metrics-overview";
import { MetricsCharts } from "@/components/broker/metrics/metrics-charts";
import { mockPerformance } from "@/mocks/performance-data";
import { mockTarget } from "@/mocks/target-data";
import { Performance, Target } from "@/types";

// Time period options for the filter
const TIME_PERIODS = [
  { label: "Este mês", value: "current_month" },
  { label: "Último mês", value: "last_month" },
  { label: "Últimos 3 meses", value: "last_3_months" },
  { label: "Últimos 6 meses", value: "last_6_months" },
  { label: "Este ano", value: "current_year" },
];

export default function BrokerMetrics() {
  const [timePeriod, setTimePeriod] = useState("current_month");
  const [performance, setPerformance] = useState<Performance>(mockPerformance);
  const [target, setTarget] = useState<Target>(mockTarget);
  
  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value);
    // In a real app, this would trigger an API call to get the performance data for the selected period
    console.log(`Fetch performance data for period: ${value}`);
  };

  return (
    <SidebarProvider>
      {({ state }) => (
        <div className="flex h-screen w-full bg-cyrela-gray-lightest">
          <Sidebar>
            <BrokerSidebarContent />
          </Sidebar>
          
          <SidebarInset>
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col h-full w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
                <MetricsHeader />
                
                <MetricsFilter 
                  timePeriods={TIME_PERIODS}
                  selectedPeriod={timePeriod}
                  onPeriodChange={handleTimePeriodChange}
                />
                
                <MetricsOverview 
                  performance={performance}
                  target={target}
                />
                
                <MetricsCharts 
                  performance={performance}
                  target={target}
                  period={timePeriod}
                />
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
