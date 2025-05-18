
import { useEffect, useState } from "react";

export const BROKER_REFERRAL_KEY = "broker_referral_id";

/**
 * Hook to handle broker referrals from URLs
 */
export function useBrokerReferral() {
  const [brokerId, setBrokerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check URL for ref parameter and store it
  useEffect(() => {
    setIsLoading(true);
    
    // First check if we already have a broker ID in storage
    const storedBrokerId = localStorage.getItem(BROKER_REFERRAL_KEY);
    
    if (storedBrokerId) {
      setBrokerId(storedBrokerId);
      setIsLoading(false);
      return;
    }
    
    // If not, check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    
    if (refParam) {
      // Store the broker ID in localStorage for persistence
      localStorage.setItem(BROKER_REFERRAL_KEY, refParam);
      setBrokerId(refParam);
    }
    
    setIsLoading(false);
  }, []);

  // Function to clear the broker referral
  const clearBrokerReferral = () => {
    localStorage.removeItem(BROKER_REFERRAL_KEY);
    setBrokerId(null);
  };

  return {
    brokerId,
    isLoading,
    clearBrokerReferral
  };
}
