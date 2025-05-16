
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export function usePeriodicSessionCheck(isAuthorized: boolean | null) {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | null = null;
    
    if (isAuthorized) {
      // Verify session every 5 minutes
      intervalId = window.setInterval(async () => {
        if (!isMounted) return;
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error || !data.session) {
            console.warn("Protected route: Session lost during periodic check");
            
            if (isMounted) {
              toast.error("Sua sessão expirou. Redirecionando para login...");
              navigate("/auth", { replace: true });
            }
          }
        } catch (err) {
          console.error("Error during periodic session check in protected route:", err);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isAuthorized, navigate]);
}
