
import { useState } from "react";
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
import { Plan, plans } from "@/types/plan";
import { EditPlanDialog } from "@/components/admin/plans/EditPlanDialog";
import { toast } from "sonner";

const AdminPlans = () => {
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleSavePlan = (updatedPlan: Plan) => {
    // In a real app, this would update the backend
    toast.success("Plano atualizado com sucesso!");
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Planos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os planos disponíveis para os usuários da plataforma
        </p>
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
          </div>
        </CardContent>
      </Card>

      <EditPlanDialog 
        plan={editingPlan}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePlan}
      />
    </div>
  );
};

export default AdminPlans;
