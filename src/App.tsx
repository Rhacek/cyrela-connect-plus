
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
import OnboardingPage from "./pages/client/OnboardingPage";
import PropertyListingPage from "./pages/client/PropertyListingPage";

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
          
          {/* Client routes */}
          <Route path="/client/onboarding" element={<OnboardingPage />} />
          <Route path="/client/results" element={<PropertyListingPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
