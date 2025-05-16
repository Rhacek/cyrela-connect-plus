
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

// Broker pages
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerProfile from "./pages/broker/BrokerProfile";
import BrokerProperties from "./pages/broker/BrokerProperties";
import BrokerSchedule from "./pages/broker/BrokerSchedule";
import BrokerLeads from "./pages/broker/BrokerLeads";
import BrokerMetrics from "./pages/broker/BrokerMetrics";
import BrokerShare from "./pages/broker/BrokerShare";
import BrokerPlans from "./pages/broker/BrokerPlans";

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
            
            {/* Broker routes - protected for broker role */}
            <Route 
              path="/broker/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/profile" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/properties" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerProperties />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/schedule" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerSchedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/leads" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerLeads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/metrics" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerMetrics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/share" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerShare />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/broker/plans" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.BROKER]}>
                  <BrokerPlans />
                </ProtectedRoute>
              } 
            />
            
            {/* Client routes */}
            <Route path="/client/welcome" element={<WelcomePage />} />
            <Route path="/client/broker" element={<BrokerIntroPage />} />
            <Route path="/client/onboarding" element={<OnboardingPage />} />
            <Route path="/client/results" element={<PropertyListingPage />} />
            <Route path="/client/property/:id" element={<PropertyDetailPage />} />
            
            {/* Admin routes - protected for admin role */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Add explicit index route */}
              <Route index element={<AdminDashboard />} />
              
              {/* Add explicit dashboard route for direct navigation */}
              <Route path="dashboard" element={<AdminDashboard />} />
              
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<AdminPropertyForm />} />
              <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
              <Route path="brokers" element={<AdminBrokers />} />
              <Route path="brokers/new" element={<AdminBrokerForm />} />
              <Route path="brokers/:id/edit" element={<AdminBrokerForm />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="plans" element={<AdminPlans />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
