
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, MessageSquare, TrendingUp } from "lucide-react";
import { mockProperties } from "@/mocks/property-data";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const AdminDashboard = () => {
  const { session, isAdmin, initialized } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // More comprehensive session verification
  useEffect(() => {
    const verifyAdminAccess = async () => {
      try {
        // Wait for auth context to be initialized
        if (!initialized) {
          console.log("Auth context not initialized yet, waiting...");
          return; // Will re-run when initialized changes
        }
        
        console.log("AdminDashboard - Verifying admin session:", {
          hasSession: !!session,
          sessionId: session?.id,
          userRole: session?.user_metadata?.role,
          isAdmin: isAdmin(),
          initialized
        });
        
        // If session exists in context and is admin, proceed
        if (session && isAdmin()) {
          console.log("Admin access confirmed via context");
          setIsLoading(false);
          return;
        }
        
        // Direct verification with Supabase if context doesn't have session
        console.log("Verifying admin access directly with Supabase");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          redirectToAuth();
          return;
        }
        
        if (!data.session) {
          console.log("No valid session found");
          redirectToAuth();
          return;
        }
        
        // Check if user has admin role
        const userRole = data.session.user.user_metadata?.role;
        if (userRole !== UserRole.ADMIN) {
          console.log("User is not an admin:", userRole);
          toast.error("Acesso administrativo necessário");
          redirectToAuth();
          return;
        }
        
        console.log("Admin access confirmed via direct check");
        setIsLoading(false);
      } catch (error) {
        console.error("Error in admin verification:", error);
        redirectToAuth();
      }
    };
    
    verifyAdminAccess();
  }, [session, isAdmin, navigate, initialized]);
  
  // Helper function to ensure consistent redirect with parameters
  const redirectToAuth = () => {
    navigate("/auth?redirect=/admin/", { replace: true });
  };

  // Show loading state while verifying
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Verificando acesso administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-2">Bem-vindo ao painel de controle.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Imóveis</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProperties.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2 no último mês
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Corretores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              +1 na última semana
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Leads Pendentes</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">
              +8 desde ontem
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +2.5% este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Imóveis Recentes</CardTitle>
            <CardDescription>Últimos imóveis adicionados ao sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockProperties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {property.images && property.images[0] && (
                      <img 
                        src={property.images[0].url} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium truncate">{property.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {property.neighborhood}, {property.city}
                    </p>
                  </div>
                  <div className="text-sm font-medium whitespace-nowrap">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(property.price)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Ações executadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
                  <Users size={14} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm">Novo corretor cadastrado</p>
                  <p className="text-xs text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
                  <Building size={14} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm">Imóvel atualizado: Living Exclusive Morumbi</p>
                  <p className="text-xs text-muted-foreground">Há 3 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="rounded-full w-8 h-8 bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare size={14} />
                </div>
                <div className="flex-grow">
                  <p className="text-sm">5 novos leads recebidos</p>
                  <p className="text-xs text-muted-foreground">Há 4 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
