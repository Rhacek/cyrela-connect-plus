
import { RecentActivity } from './types';

/**
 * Gets a list of recent activities
 * Note: This is currently a simulation since we don't have a real activities table
 */
export const getRecentActivities = async (pendingLeads: number): Promise<RecentActivity[]> => {
  try {
    // Since we don't have a real activities table, let's simulate some activities
    // In a real implementation, you would fetch from an actual activities or audit log table
    const recentActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'user',
        description: 'Novo corretor cadastrado',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        icon: 'users'
      },
      {
        id: '2',
        type: 'property',
        description: 'Imóvel atualizado: Apartamento recente',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        icon: 'building'
      },
      {
        id: '3',
        type: 'lead',
        description: `${pendingLeads || 0} novos leads recebidos`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        icon: 'messageSquare'
      }
    ];
    
    return recentActivities;
  } catch (error) {
    console.error("Error creating activities:", error);
    return [];
  }
};
