
export interface AdminStats {
  totalProperties: number;
  activeAgents: number;
  pendingLeads: number;
  conversionRate: number;
  propertiesGrowth: number;
  brokersGrowth: number;
  leadsGrowth: number;
  recentProperties: RecentProperty[];
  recentActivities: RecentActivity[];
}

export interface RecentProperty {
  id: string;
  title: string;
  neighborhood: string;
  city: string;
  price: number;
  image?: string;
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'property' | 'lead';
  description: string;
  timestamp: Date;
  icon: 'users' | 'building' | 'messageSquare';
}
