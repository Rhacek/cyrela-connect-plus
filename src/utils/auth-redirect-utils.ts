import { UserSession } from "@/types/auth";
import { UserRole } from "@/types";
import { NavigateFunction } from "react-router-dom";

/**
 * Redirects the user based on their role and any redirect parameter
 */
export const redirectBasedOnRole = (
  userSession: UserSession, 
  redirectPath: string | null,
  navigate: NavigateFunction,
  currentPath: string
) => {
  console.log("Auth redirect detected existing session, redirecting based on role");
  
  // Get the role from the user_metadata
  const userRole = userSession.user_metadata.role;
  
  console.log("User role detected:", userRole);
  
  // If there's a specific redirect path, use it unless it's admin path with wrong role
  // or a client path (which should be accessible regardless of authentication)
  if (redirectPath) {
    // Don't redirect to client paths - they should be publicly accessible
    if (redirectPath.startsWith('/client')) {
      console.log(`Client path detected: ${redirectPath}, navigating`);
      navigate(redirectPath, { replace: true });
      return;
    }
    
    // Only redirect to admin paths if user is admin
    if (redirectPath.startsWith('/admin') && userRole !== UserRole.ADMIN) {
      console.log("Attempt to redirect to admin path, but user is not admin");
      redirectToDefaultForRole(userRole, navigate, currentPath);
      return;
    }
    
    // Only redirect to broker paths if user is broker
    if (redirectPath.startsWith('/broker') && userRole !== UserRole.BROKER) {
      console.log("Attempt to redirect to broker path, but user is not broker");
      redirectToDefaultForRole(userRole, navigate, currentPath);
      return;
    }
    
    // Avoid redirecting to the current path
    if (currentPath !== redirectPath) {
      console.log(`Redirecting to specified path: ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    } else {
      console.log(`Already at specified path: ${redirectPath}, skipping redirect`);
    }
    return;
  }
  
  // Otherwise redirect to role-specific default page
  redirectToDefaultForRole(userRole, navigate, currentPath);
};

/**
 * Redirects to the default page for a specific user role
 */
export const redirectToDefaultForRole = (
  userRole: UserRole,
  navigate: NavigateFunction,
  currentPath: string
) => {
  // Avoid redirecting if already at the target route
  if (userRole === UserRole.BROKER && currentPath === "/broker/dashboard") {
    console.log("Already at broker dashboard, skipping redirect");
    return;
  }
  
  if (userRole === UserRole.ADMIN && currentPath === "/admin/") {
    console.log("Already at admin dashboard, skipping redirect");
    return;
  }
  
  if (userRole === UserRole.CLIENT && currentPath === "/client/welcome") {
    console.log("Already at client welcome page, skipping redirect");
    return;
  }
  
  // Proceed with redirection if needed
  if (userRole === UserRole.BROKER) {
    // Only redirect if not already at broker dashboard
    if (currentPath !== "/broker/dashboard") {
      console.log("Redirecting to broker dashboard");
      navigate("/broker/dashboard", { replace: true });
    } else {
      console.log("Already at broker dashboard, skipping redirect");
    }
  } else if (userRole === UserRole.ADMIN) {
    // Always redirect admins to /admin/ with trailing slash  
    // Only if not already there
    if (currentPath !== "/admin/") {
      console.log("Redirecting to admin dashboard with trailing slash");
      navigate("/admin/", { replace: true });
    } else {
      console.log("Already at admin dashboard, skipping redirect");
    }
  } else if (userRole === UserRole.CLIENT) {
    // Only if not already there
    if (currentPath !== "/client/welcome") {
      console.log("Redirecting to client welcome page");
      navigate("/client/welcome", { replace: true });
    } else {
      console.log("Already at client welcome page, skipping redirect");
    }
  } else {
    // Fallback for unknown roles
    // Only if not already at home
    if (currentPath !== "/") {
      console.log("Unknown role, redirecting to home page");
      navigate("/", { replace: true });
    } else {
      console.log("Already at home page, skipping redirect");
    }
  }
};
