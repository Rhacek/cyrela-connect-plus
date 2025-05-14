
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerProfile from "./pages/broker/BrokerProfile";
import BrokerProperties from "./pages/broker/BrokerProperties";
import BrokerSchedule from "./pages/broker/BrokerSchedule";
import BrokerLeads from "./pages/broker/BrokerLeads";
import BrokerMetrics from "./pages/broker/BrokerMetrics";
import BrokerShare from "./pages/broker/BrokerShare";
import BrokerPlans from "./pages/broker/BrokerPlans";
import WelcomePage from "./pages/client/WelcomePage";
import BrokerIntroPage from "./pages/client/BrokerIntroPage";
import OnboardingPage from "./pages/client/OnboardingPage";
import PropertyListingPage from "./pages/client/PropertyListingPage";
import PropertyDetailPage from "./pages/client/PropertyDetailPage";
import PlansPage from "./pages/client/PlansPage";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminPropertyForm from "./pages/admin/AdminPropertyForm";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminBrokerForm from "./pages/admin/AdminBrokerForm";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPlans from "./pages/admin/AdminPlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Broker routes */}
          <Route path="/broker/dashboard" element={<BrokerDashboard />} />
          <Route path="/broker/profile" element={<BrokerProfile />} />
          <Route path="/broker/properties" element={<BrokerProperties />} />
          <Route path="/broker/schedule" element={<BrokerSchedule />} />
          <Route path="/broker/leads" element={<BrokerLeads />} />
          <Route path="/broker/metrics" element={<BrokerMetrics />} />
          <Route path="/broker/share" element={<BrokerShare />} />
          <Route path="/broker/plans" element={<BrokerPlans />} />
          
          {/* Client routes */}
          <Route path="/client/welcome" element={<WelcomePage />} />
          <Route path="/client/broker" element={<BrokerIntroPage />} />
          <Route path="/client/onboarding" element={<OnboardingPage />} />
          <Route path="/client/results" element={<PropertyListingPage />} />
          <Route path="/client/property/:id" element={<PropertyDetailPage />} />
          <Route path="/client/plans" element={<PlansPage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="properties/new" element={<AdminPropertyForm />} />
            <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
            <Route path="brokers" element={<AdminBrokers />} />
            <Route path="brokers/new" element={<AdminBrokerForm />} />
            <Route path="brokers/:id/edit" element={<AdminBrokerForm />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="plans" element={<AdminPlans />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
