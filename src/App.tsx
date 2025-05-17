
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@/types";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

// Broker pages and layout
import BrokerLayout from "./components/broker/BrokerLayout"; // Import the BrokerLayout
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerProfile from "./pages/broker/BrokerProfile";
import BrokerProperties from "./pages/broker/BrokerProperties";
import BrokerSchedule from "./pages/broker/BrokerSchedule";
import BrokerLeads from "./pages/broker/BrokerLeads";
import BrokerMetrics from "./pages/broker/BrokerMetrics";
import BrokerShare from "./pages/broker/BrokerShare";
import BrokerPlans from "./pages/broker/BrokerPlans";
import BrokerSettings from "./pages/broker/BrokerSettings";

// Client pages
import WelcomePage from "./pages/client/WelcomePage";
import BrokerIntroPage from "./pages/client/BrokerIntroPage";
import OnboardingPage from "./pages/client/OnboardingPage";
import PropertyListingPage from "./pages/client/PropertyListingPage";
import PropertyDetailPage from "./pages/client/PropertyDetailPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminPropertyForm from "./pages/admin/AdminPropertyForm";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminBrokerForm from "./pages/admin/AdminBrokerForm";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPlans from "./pages/admin/AdminPlans";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Broker routes - protected for broker role and using BrokerLayout */}
            <Route 
              path="/broker" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/broker/dashboard" replace />} />
              <Route path="dashboard" element={<BrokerDashboard />} />
              <Route path="profile" element={<BrokerProfile />} />
              <Route path="properties" element={<BrokerProperties />} />
              <Route path="schedule" element={<BrokerSchedule />} />
              <Route path="leads" element={<BrokerLeads />} />
              <Route path="metrics" element={<BrokerMetrics />} />
              <Route path="share" element={<BrokerShare />} />
              <Route path="plans" element={<BrokerPlans />} />
              <Route path="settings" element={<BrokerSettings />} />
            </Route>
            
            {/* Client routes */}
            <Route path="/client/welcome" element={<WelcomePage />} />
            <Route path="/client/broker" element={<BrokerIntroPage />} />
            <Route path="/client/onboarding" element={<OnboardingPage />} />
            <Route path="/client/results" element={<PropertyListingPage />} />
            <Route path="/client/property/:id" element={<PropertyDetailPage />} />
            
            {/* Admin routes - protected for admin role */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<Navigate to="/admin/" replace />} />
              <Route path="properties/" element={<AdminProperties />} />
              <Route path="properties/new/" element={<AdminPropertyForm />} />
              <Route path="properties/:id/edit/" element={<AdminPropertyForm />} />
              <Route path="brokers/" element={<AdminBrokers />} />
              <Route path="brokers/new/" element={<AdminBrokerForm />} />
              <Route path="brokers/:id/edit/" element={<AdminBrokerForm />} />
              <Route path="settings/" element={<AdminSettings />} />
              <Route path="plans/" element={<AdminPlans />} />
            </Route>
            
            {/* Redirects to ensure consistent trailing slashes */}
            <Route path="/admin" element={<Navigate to="/admin/" replace />} />
            <Route path="/admin/properties" element={<Navigate to="/admin/properties/" replace />} />
            <Route path="/admin/brokers" element={<Navigate to="/admin/brokers/" replace />} />
            <Route path="/admin/plans" element={<Navigate to="/admin/plans/" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/settings/" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
