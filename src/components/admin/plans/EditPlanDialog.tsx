
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plan } from "@/types/plan";
import { PlanType } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditPlanDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (plan: Plan) => void;
}

export function EditPlanDialog({ plan, open, onOpenChange, onSave }: EditPlanDialogProps) {
  const [editedPlan, setEditedPlan] = useState<Partial<Plan>>({});
  
  useEffect(() => {
    if (plan) {
      setEditedPlan(plan);
    }
  }, [plan]);
  
  const handleSave = () => {
    if (editedPlan && plan) {
      onSave({
        ...plan,
        ...editedPlan,
      } as Plan);
    }
  };
  
  if (!plan) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Plano</DialogTitle>
          <DialogDescription>
            Ajuste as configurações do plano conforme necessário
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              value={editedPlan.name || ""}
              onChange={(e) => setEditedPlan({ ...editedPlan, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Preço
            </Label>
            <Input
              id="price"
              type="number"
              value={editedPlan.price || 0}
              onChange={(e) => setEditedPlan({ ...editedPlan, price: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select
              value={editedPlan.type}
              onValueChange={(value) => setEditedPlan({ ...editedPlan, type: value as PlanType })}
            >
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlanType.FREE}>Gratuito</SelectItem>
                <SelectItem value={PlanType.PRO}>Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="billing" className="text-right">
              Período
            </Label>
            <Select
              value={editedPlan.billingPeriod}
              onValueChange={(value) => 
                setEditedPlan({ 
                  ...editedPlan, 
                  billingPeriod: value as "monthly" | "yearly" 
                })
              }
            >
              <SelectTrigger id="billing" className="col-span-3">
                <SelectValue placeholder="Selecione um período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="yearly">Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="popular" className="text-right">
              Mais Popular
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="popular"
                checked={editedPlan.isMostPopular || false}
                onCheckedChange={(checked) => 
                  setEditedPlan({ ...editedPlan, isMostPopular: checked })
                }
              />
              <Label htmlFor="popular">
                {editedPlan.isMostPopular ? "Sim" : "Não"}
              </Label>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={editedPlan.description || ""}
              onChange={(e) => setEditedPlan({ ...editedPlan, description: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
