
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types";

/**
 * Redirects user based on their role to the appropriate home page
 */
export const redirectBasedOnRole = (
  userRole: UserRole, 
  currentPath: string,
  debouncedNavigate: (path: string) => void
): void => {
  console.log("Role-based redirection for:", {
    userRole,
    currentPath
  });
  
  // Show unauthorized toast
  toast.error("Você não tem permissão para acessar esta página");
  
  // Redirect based on role using debounced navigation - BUT ONLY REDIRECT FROM ROOT PATHS
  switch (userRole) {
    case UserRole.ADMIN:
      // Only redirect if at root admin path
      if (currentPath === "/admin") {
        debouncedNavigate("/admin/");
      }
      break;
    case UserRole.BROKER:
      // Only redirect if at root broker path
      if (currentPath === "/broker") {
        debouncedNavigate("/broker/dashboard");
      }
      break;
    case UserRole.CLIENT:
      // Only redirect if at root client path
      if (currentPath === "/client") {
        debouncedNavigate("/client/welcome");
      }
      break;
    default:
      // Only redirect if not already on auth
      if (currentPath !== "/auth") {
        debouncedNavigate("/auth");
      }
      break;
  }
};

/**
 * Checks if a route is protected (requires authentication)
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/broker') || pathname.startsWith('/admin');
};

/**
 * Checks if a route is a client route (public)
 */
export const isClientRoute = (pathname: string): boolean => {
  return pathname.startsWith('/client');
};
