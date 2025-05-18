
import { useShareLinks, useShareStats, useCreateShare } from "./shares";

/**
 * Combined hook that provides all share-related functionality for a broker
 */
export function useBrokerShares(brokerId: string | undefined) {
  // Individual hooks
  const { 
    data: sharedLinks = [],
    isLoading: isLoadingLinks, 
    error: linksError
  } = useShareLinks(brokerId);
  
  const { 
    data: stats = {
      totalShares: 0,
      totalClicks: 0,
      activeLinks: 0,
      averageClicksPerShare: 0,
      mostSharedProperty: null
    },
    isLoading: isLoadingStats, 
    error: statsError
  } = useShareStats(brokerId);
  
  const createShareLink = useCreateShare();

  // Return combined data and actions
  return {
    // Links data
    sharedLinks,
    isLoadingLinks,
    linksError,
    
    // Stats data
    stats,
    isLoadingStats,
    statsError,
    
    // Actions
    createShareLink,
  };
}
