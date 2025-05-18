
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Target } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBrokerTargets() {
  const navigate = useNavigate();
  const [brokers, setBrokers] = useState<any[]>([]);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>("");
  const [targetDate, setTargetDate] = useState<{month: number, year: number}>({
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [target, setTarget] = useState<Target>({
    id: "",
    brokerId: "",
    month: targetDate.month,
    year: targetDate.year,
    shareTarget: 0,
    leadTarget: 0,
    scheduleTarget: 0,
    visitTarget: 0,
    saleTarget: 0
  });

  // Load brokers
  useEffect(() => {
    const loadBrokers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email')
          .eq('role', 'BROKER')
          .order('name');
          
        if (error) throw error;
        setBrokers(data || []);
      } catch (error) {
        console.error('Error loading brokers:', error);
        toast.error("Erro ao carregar corretores.");
      }
    };
    
    loadBrokers();
  }, []);

  // Load target data when broker and date changes
  useEffect(() => {
    if (!selectedBrokerId) return;
    
    const loadTargetData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('targets')
          .select('*')
          .eq('broker_id', selectedBrokerId)
          .eq('month', targetDate.month)
          .eq('year', targetDate.year)
          .single();
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows returned"
          throw error;
        }
        
        if (data) {
          // Map database fields to Target object
          setTarget({
            id: data.id,
            brokerId: data.broker_id,
            month: data.month,
            year: data.year,
            shareTarget: data.share_target,
            leadTarget: data.lead_target,
            scheduleTarget: data.schedule_target,
            visitTarget: data.visit_target,
            saleTarget: data.sale_target
          });
        } else {
          // Reset to default values when no target exists
          setTarget({
            id: "",
            brokerId: selectedBrokerId,
            month: targetDate.month,
            year: targetDate.year,
            shareTarget: 0,
            leadTarget: 0,
            scheduleTarget: 0,
            visitTarget: 0,
            saleTarget: 0
          });
        }
      } catch (error) {
        console.error('Error loading target data:', error);
        toast.error("Erro ao carregar dados de meta.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTargetData();
  }, [selectedBrokerId, targetDate]);

  // Handle broker selection change
  const handleBrokerChange = (brokerId: string) => {
    setSelectedBrokerId(brokerId);
  };

  // Handle month change
  const handleMonthChange = (month: string) => {
    setTargetDate(prev => ({...prev, month: parseInt(month)}));
  };

  // Handle year change
  const handleYearChange = (year: string) => {
    setTargetDate(prev => ({...prev, year: parseInt(year)}));
  };

  // Handle input changes
  const handleInputChange = (field: keyof Target, value: string) => {
    const numValue = parseInt(value) || 0;
    setTarget(prev => ({...prev, [field]: numValue}));
  };

  // Save target data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const targetData = {
        broker_id: selectedBrokerId,
        month: targetDate.month,
        year: targetDate.year,
        share_target: target.shareTarget,
        lead_target: target.leadTarget,
        schedule_target: target.scheduleTarget,
        visit_target: target.visitTarget,
        sale_target: target.saleTarget
      };
      
      let response;
      
      if (target.id) {
        // Update existing target
        response = await supabase
          .from('targets')
          .update(targetData)
          .eq('id', target.id);
      } else {
        // Insert new target
        response = await supabase
          .from('targets')
          .insert(targetData);
      }
      
      if (response.error) throw response.error;
      
      toast.success("Metas salvas com sucesso!");
    } catch (error) {
      console.error('Error saving target data:', error);
      toast.error("Erro ao salvar dados de meta.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate month options
  const monthOptions = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" }
  ];

  // Generate year options (current year +/- 2 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Metas de Corretores</h1>
          <p className="text-muted-foreground">Defina metas mensais para cada corretor</p>
        </div>
        <Button 
          variant="default" 
          onClick={() => navigate('/admin/brokers/')}
        >
          Voltar para Corretores
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Definir Metas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="broker">Corretor</Label>
                <Select value={selectedBrokerId} onValueChange={handleBrokerChange}>
                  <SelectTrigger id="broker">
                    <SelectValue placeholder="Selecione um corretor" />
                  </SelectTrigger>
                  <SelectContent>
                    {brokers.map(broker => (
                      <SelectItem key={broker.id} value={broker.id}>
                        {broker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="month">Mês</Label>
                <Select value={targetDate.month.toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Ano</Label>
                <Select value={targetDate.year.toString()} onValueChange={handleYearChange}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : selectedBrokerId ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shareTarget">Meta de Compartilhamentos</Label>
                    <Input
                      id="shareTarget"
                      type="number"
                      min="0"
                      value={target.shareTarget}
                      onChange={(e) => handleInputChange("shareTarget", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="leadTarget">Meta de Leads</Label>
                    <Input
                      id="leadTarget"
                      type="number"
                      min="0"
                      value={target.leadTarget}
                      onChange={(e) => handleInputChange("leadTarget", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="scheduleTarget">Meta de Agendamentos</Label>
                    <Input
                      id="scheduleTarget"
                      type="number"
                      min="0"
                      value={target.scheduleTarget}
                      onChange={(e) => handleInputChange("scheduleTarget", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="visitTarget">Meta de Visitas</Label>
                    <Input
                      id="visitTarget"
                      type="number"
                      min="0"
                      value={target.visitTarget}
                      onChange={(e) => handleInputChange("visitTarget", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="saleTarget">Meta de Vendas</Label>
                    <Input
                      id="saleTarget"
                      type="number"
                      min="0"
                      value={target.saleTarget}
                      onChange={(e) => handleInputChange("saleTarget", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 border rounded-md bg-slate-50">
                <Calendar className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-slate-500 font-medium">Selecione um Corretor</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Escolha um corretor para definir ou atualizar suas metas
                </p>
              </div>
            )}

            {selectedBrokerId && (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/brokers/')}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !selectedBrokerId}
                >
                  {isSaving ? "Salvando..." : "Salvar Metas"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
