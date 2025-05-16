
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { PlanType } from "@/types";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { toast } from "sonner";
import { Plan, plansService } from "@/services/plans.service";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

const AdminPlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const data = await plansService.getAll();
      setPlans(data);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      toast.error("Erro ao carregar planos. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleNewPlan = () => {
    setIsCreating(true);
    setEditingPlan({
      id: "",
      name: "",
      description: "",
      price: 0,
      type: PlanType.FREE,
      billingPeriod: "monthly",
      features: [],
      isActive: true,
      isMostPopular: false
    });
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setIsCreating(false);
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleSavePlan = async (updatedPlan: Plan) => {
    try {
      if (isCreating) {
        // Criar novo plano
        const { id, ...planData } = updatedPlan;
        const newPlan = await plansService.create(planData);
        setPlans(prev => [...prev, newPlan]);
        toast.success("Plano criado com sucesso!");
      } else {
        // Atualizar plano existente
        await plansService.update(updatedPlan.id, updatedPlan);
        setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        toast.success("Plano atualizado com sucesso!");
      }
      
      setIsDialogOpen(false);
      setEditingPlan(null);
    } catch (error) {
      console.error("Erro ao salvar plano:", error);
      toast.error("Erro ao salvar plano. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os planos disponíveis para os usuários da plataforma
          </p>
        </div>
        <Button onClick={handleNewPlan}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Plano
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <CardDescription>
            Gerencie os planos disponíveis para os usuários da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : (
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Mais Popular</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>{plan.type === PlanType.FREE ? "Gratuito" : "Pro"}</TableCell>
                      <TableCell>
                        {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        {plan.billingPeriod === "monthly" ? "Mensal" : "Anual"}
                      </TableCell>
                      <TableCell>{plan.isMostPopular ? "Sim" : "Não"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPlan(plan)}
                        >
                          Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      <EditPlanDialog 
        plan={editingPlan}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePlan}
        isCreating={isCreating}
      />
    </div>
  );
};

export default AdminPlans;
