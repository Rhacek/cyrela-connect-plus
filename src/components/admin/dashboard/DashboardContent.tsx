
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface RecentProperty {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  price: number;
  image?: string;
}

interface RecentActivity {
  id: string;
  type: 'user' | 'property' | 'lead';
  description: string;
  timestamp: Date;
  icon: 'users' | 'building' | 'messageSquare';
}

interface DashboardContentProps {
  recentProperties: RecentProperty[];
  recentActivities: RecentActivity[];
}

export const DashboardContent = ({ recentProperties, recentActivities }: DashboardContentProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <RecentPropertiesCard properties={recentProperties} />
      <RecentActivitiesCard activities={recentActivities} />
    </div>
  );
};

interface RecentPropertiesCardProps {
  properties: RecentProperty[];
}

const RecentPropertiesCard = ({ properties }: RecentPropertiesCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Imóveis Recentes</CardTitle>
        <CardDescription>Últimos imóveis adicionados ao sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                  {property.image && (
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium truncate">{property.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {property.neighborhood}, {property.city}
                  </p>
                </div>
                <div className="text-sm font-medium whitespace-nowrap">
                  {formatCurrency(property.price)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhum imóvel cadastrado recentemente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivitiesCardProps {
  activities: RecentActivity[];
}

const RecentActivitiesCard = ({ activities }: RecentActivitiesCardProps) => {
  const getActivityIcon = (icon: 'users' | 'building' | 'messageSquare') => {
    switch (icon) {
      case 'users':
        return <Users size={14} />;
      case 'building':
        return <Building size={14} />;
      case 'messageSquare':
        return <MessageSquare size={14} />;
      default:
        return <Users size={14} />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Ações executadas no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
                  {getActivityIcon(activity.icon)}
                </div>
                <div className="flex-grow">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
                      Math.round((new Date(activity.timestamp).getTime() - Date.now()) / (1000 * 60 * 60)), 
                      'hour'
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Nenhuma atividade recente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
