
import { BarChart2, ExternalLink, Link2, Share } from "lucide-react";
import { ShareStatsCard } from "./share-stats-card";

interface ShareStatsGridProps {
  totalShares: number;
  totalClicks: number;
  activeLinks: number;
  averageClicksPerShare: number;
  mostSharedProperty: {
    id: string;
    name: string;
    count: number;
  };
}

export function ShareStatsGrid({
  totalShares,
  totalClicks,
  activeLinks,
  averageClicksPerShare,
  mostSharedProperty,
}: ShareStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <ShareStatsCard
        title="Total de Links"
        value={totalShares}
        icon={<Link2 className="h-4 w-4" />}
        description="Links personalizados criados"
      />
      
      <ShareStatsCard
        title="Total de Cliques"
        value={totalClicks}
        icon={<ExternalLink className="h-4 w-4" />}
        description="Visitantes em seus links"
        trend={{
          value: 12,
          label: "em relação ao mês anterior",
          isPositive: true,
        }}
      />
      
      <ShareStatsCard
        title="Links Ativos"
        value={activeLinks}
        icon={<Share className="h-4 w-4" />}
        description={`${Math.round((activeLinks / totalShares) * 100)}% do total`}
      />
      
      <ShareStatsCard
        title="Cliques por Link"
        value={averageClicksPerShare}
        icon={<BarChart2 className="h-4 w-4" />}
        description="Média de conversão"
      />
    </div>
  );
}
