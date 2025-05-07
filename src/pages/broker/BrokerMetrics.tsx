
import { useState, useEffect } from "react";
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
import { mockHistoricalPerformance } from "@/mocks/performance-data";
import { Performance, Target } from "@/types";

export default function BrokerMetrics() {
  // Get current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [performance, setPerformance] = useState<Performance>(mockPerformance);
  const [target, setTarget] = useState<Target>(mockTarget);
  
  // Update data when month or year changes
  useEffect(() => {
    // In a real app, this would fetch data from an API based on month and year
    console.log(`Fetch performance data for: ${selectedMonth}/${selectedYear}`);
    
    // Find historical performance data matching the selected month and year
    const historicalData = mockHistoricalPerformance.find(
      item => item.month === selectedMonth + 1 && item.year === selectedYear
    );
    
    // Update performance if data is found
    if (historicalData) {
      setPerformance({
        id: "perf-" + selectedMonth + "-" + selectedYear,
        brokerId: "broker1",
        month: selectedMonth + 1,
        year: selectedYear,
        shares: historicalData.shares,
        leads: historicalData.leads,
        schedules: historicalData.schedules,
        visits: historicalData.visits,
        sales: historicalData.sales
      });
    } else {
      // Fallback to current data if no historical data found
      setPerformance({
        ...mockPerformance,
        month: selectedMonth + 1,
        year: selectedYear
      });
    }
    
    // For target data we'll use the same mockTarget for simplicity
    // In a real app, you'd fetch the target data for the selected month as well
    setTarget({
      ...mockTarget,
      month: selectedMonth + 1,
      year: selectedYear
    });
  }, [selectedMonth, selectedYear]);

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
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
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  onMonthYearChange={handleMonthYearChange}
                />
                
                <MetricsOverview 
                  performance={performance}
                  target={target}
                />
                
                <MetricsCharts 
                  performance={performance}
                  target={target}
                  period={`${selectedMonth}_${selectedYear}`}
                />
              </div>
            </ScrollArea>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
