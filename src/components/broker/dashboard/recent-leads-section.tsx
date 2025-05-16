
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/types";
import { LeadCard } from "./lead-card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

interface RecentLeadsSectionProps {
  leads: Lead[];
  className?: string;
  isLoading?: boolean;
}

export function RecentLeadsSection({ leads, className, isLoading = false }: RecentLeadsSectionProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Leads Recentes</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : leads && leads.length > 0 ? (
          <div className="space-y-3">
            {leads.slice(0, 3).map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-cyrela-gray-dark">
            <p>Você ainda não tem leads.</p>
            <p className="text-sm mt-2">Compartilhe imóveis para começar a gerar leads.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link to="/broker/leads">Ver todos os leads</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
