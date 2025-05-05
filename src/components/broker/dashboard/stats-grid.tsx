
import { Share, Users, Calendar, Home } from "lucide-react";
import { StatsCard } from "@/components/broker/dashboard/stats-card";
import { Performance, Target } from "@/types";

interface StatsGridProps {
  performance: Performance;
  target: Target;
}

export function StatsGrid({ performance, target }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
      <StatsCard
        title="Compartilhamentos"
        value={performance.shares}
        trend="up"
        trendValue="15% ↑"
        target={target.shareTarget}
        icon={<Share size={18} className="text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Leads"
        value={performance.leads}
        trend="up"
        trendValue="8% ↑"
        target={target.leadTarget}
        icon={<Users size={18} className="text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Agendamentos"
        value={performance.schedules}
        trend="neutral"
        trendValue="0% ="
        target={target.scheduleTarget}
        icon={<Calendar size={18} className="text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Visitas"
        value={performance.visits}
        trend="up"
        trendValue="33% ↑"
        target={target.visitTarget}
        icon={<Home size={18} className="text-cyrela-blue" />}
        className="w-full h-full"
      />
    </div>
  );
}
