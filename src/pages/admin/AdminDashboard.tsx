import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, MessageSquare, TrendingUp } from "lucide-react";
import { mockProperties } from "@/mocks/property-data";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";

const AdminDashboard = () => {
  const { session, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Verify admin access on dashboard page load
  useEffect(() => {
    console.log("AdminDashboard mounted, verifying admin session:", {
      hasSession: !!session,
      sessionId: session?.id,
      userRole: session?.user_metadata?.role,
      isAdmin: isAdmin()
    });
    
    // Double-check admin role
    if (!session || !isAdmin()) {
      console.log("Non-admin access attempted for dashboard, redirecting");
      navigate("/auth", { replace: true });
      return;
    }
    
    console.log("Admin access confirmed for dashboard");
  }, [session, isAdmin, navigate]);

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
