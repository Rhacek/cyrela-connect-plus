
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Performance } from "@/types";

interface ConversionChartProps {
  performance: Performance;
}

export function ConversionChart({ performance }: ConversionChartProps) {
  // Conversion rates
  const conversionRates = [
    { 
      name: "Compartilhamentos → Leads", 
      rate: Math.round((performance.leads / performance.shares) * 100)
    },
    { 
      name: "Leads → Agendamentos", 
      rate: Math.round((performance.schedules / performance.leads) * 100) 
    },
    { 
      name: "Agendamentos → Visitas", 
      rate: Math.round((performance.visits / performance.schedules) * 100) 
    },
    { 
      name: "Visitas → Vendas", 
      rate: Math.round((performance.sales / performance.visits) * 100) 
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Taxas de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversionRates.map((item) => (
            <Card key={item.name} className="bg-gray-50">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">{item.rate}%</span>
                  <span className="text-xs text-cyrela-gray-dark mb-1">taxa de conversão</span>
                </div>
                <Progress value={item.rate} className="h-2 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
