
import { Share, Users, Calendar, Home } from "lucide-react";
import { StatsCard } from "@/components/broker/dashboard/stats-card";
import { Performance, Target } from "@/types";
import { cn } from "@/lib/utils";

interface StatsGridProps {
  performance: Performance;
  target: Target;
  className?: string;
}

export function StatsGrid({ performance, target, className }: StatsGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full",
      className
    )}>
      <StatsCard
        title="Compartilhamentos"
        value={performance.shares}
        trend="up"
        trendValue="15% ↑"
        target={target.shareTarget}
        icon={<Share size={16} className="sm:size-18 text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Leads"
        value={performance.leads}
        trend="up"
        trendValue="8% ↑"
        target={target.leadTarget}
        icon={<Users size={16} className="sm:size-18 text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Agendamentos"
        value={performance.schedules}
        trend="neutral"
        trendValue="0% ="
        target={target.scheduleTarget}
        icon={<Calendar size={16} className="sm:size-18 text-cyrela-blue" />}
        className="w-full h-full"
      />
      
      <StatsCard
        title="Visitas"
        value={performance.visits}
        trend="up"
        trendValue="33% ↑"
        target={target.visitTarget}
        icon={<Home size={16} className="sm:size-18 text-cyrela-blue" />}
        className="w-full h-full"
      />
    </div>
  );
}
