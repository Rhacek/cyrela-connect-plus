import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/auth-context";
import { SubscriptionProvider } from "./context/subscription-context";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts
import AdminLayout from "./components/admin/AdminLayout";
import BrokerLayout from "./components/broker/BrokerLayout";
import ClientLayout from "./components/client/ClientLayout";
import AuthLayout from "./components/auth/AuthLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPropertyDetail from "./pages/admin/AdminPropertyDetail";
import AdminBrokerDetail from "./pages/admin/AdminBrokerDetail";

// Broker Pages
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import BrokerProperties from "./pages/broker/BrokerProperties";
import BrokerPropertyDetailPage from "./pages/broker/BrokerPropertyDetailPage";
import BrokerLeads from "./pages/broker/BrokerLeads";
import BrokerSchedule from "./pages/broker/BrokerSchedule";
import BrokerMetrics from "./pages/broker/BrokerMetrics";
import BrokerProfile from "./pages/broker/BrokerProfile";
import BrokerSettings from "./pages/broker/BrokerSettings";
import BrokerPlans from "./pages/broker/BrokerPlans";
import BrokerShare from "./pages/broker/BrokerShare";

// Client Pages
import WelcomePage from "./pages/client/WelcomePage";
import PropertyListingPage from "./pages/client/PropertyListingPage";
import PropertyDetailPage from "./pages/client/PropertyDetailPage";
import OnboardingPage from "./pages/client/OnboardingPage";
import BrokerIntroPage from "./pages/client/BrokerIntroPage";

// Other
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/protected-route";
import { Toaster } from "./components/ui/toaster";

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <ClientLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "properties", element: <PropertyListingPage /> },
      { path: "properties/:id", element: <PropertyDetailPage /> },
      { path: "broker/:id", element: <BrokerIntroPage /> },
    ],
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "brokers", element: <AdminBrokers /> },
      { path: "brokers/:id", element: <AdminBrokerDetail /> },
      { path: "properties", element: <AdminProperties /> },
      { path: "properties/:id", element: <AdminPropertyDetail /> },
      { path: "settings", element: <AdminSettings /> },
    ],
  },
  {
    path: "/broker",
    element: (
      <ProtectedRoute requiredRole="BROKER">
        <BrokerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BrokerDashboard /> },
      { path: "dashboard", element: <BrokerDashboard /> },
      { path: "properties", element: <BrokerProperties /> },
      { path: "properties/:id", element: <BrokerPropertyDetailPage /> },
      { path: "leads", element: <BrokerLeads /> },
      { path: "schedule", element: <BrokerSchedule /> },
      { path: "metrics", element: <BrokerMetrics /> },
      { path: "profile", element: <BrokerProfile /> },
      { path: "settings", element: <BrokerSettings /> },
      { path: "plans", element: <BrokerPlans /> },
      { path: "share", element: <BrokerShare /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SubscriptionProvider>
            <TooltipProvider>
              <Suspense fallback={<div>Carregando...</div>}>
                <RouterProvider router={router} />
              </Suspense>
              <Toaster />
            </TooltipProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
