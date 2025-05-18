
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const BROKER_REFERRAL_KEY = "broker_referral_id";

/**
 * Hook to handle broker referrals from URLs
 */
export function useBrokerReferral() {
  const [brokerId, setBrokerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // On mount or URL change, check for ref parameter and store it
  useEffect(() => {
    setIsLoading(true);
    
    // Get the URL parameters
    const queryParams = new URLSearchParams(location.search);
    const refParam = queryParams.get("ref");
    
    // First check URL parameters
    if (refParam) {
      console.log("Found broker referral ID in URL:", refParam);
      // Store the broker ID in localStorage for persistence
      localStorage.setItem(BROKER_REFERRAL_KEY, refParam);
      setBrokerId(refParam);
      setIsLoading(false);
      return;
    }
    
    // If not in URL, check if we have a stored broker ID in localStorage
    const storedBrokerId = localStorage.getItem(BROKER_REFERRAL_KEY);
    
    if (storedBrokerId) {
      console.log("Using stored broker referral ID:", storedBrokerId);
      setBrokerId(storedBrokerId);
    } else {
      console.log("No broker referral ID found");
      setBrokerId(null);
    }
    
    setIsLoading(false);
  }, [location.search]);

  // Function to clear the broker referral
  const clearBrokerReferral = () => {
    localStorage.removeItem(BROKER_REFERRAL_KEY);
    setBrokerId(null);
    console.log("Broker referral cleared");
  };

  return {
    brokerId,
    isLoading,
    clearBrokerReferral
  };
}
