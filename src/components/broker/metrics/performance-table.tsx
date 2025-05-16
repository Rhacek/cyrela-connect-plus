
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceTableProps {
  data: any[];
  isLoading?: boolean;
  isYearly?: boolean;
}

export function PerformanceTable({ data, isLoading = false, isYearly = false }: PerformanceTableProps) {
  if (isLoading) {
    return (
      <div className="w-full h-[300px]">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  // Function to format month names in Portuguese
  const getMonthName = (monthNumber: number) => {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    return months[monthNumber - 1]; // Adjusting for 0-based array
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{isYearly ? "Ano" : "Mês"}</TableHead>
            <TableHead className="text-right">Compartilhamentos</TableHead>
            <TableHead className="text-right">Leads</TableHead>
            <TableHead className="text-right">Agendamentos</TableHead>
            <TableHead className="text-right">Visitas</TableHead>
            <TableHead className="text-right">Vendas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                {isYearly ? item.year : getMonthName(item.month)}
              </TableCell>
              <TableCell className="text-right">{item.shares}</TableCell>
              <TableCell className="text-right">{item.leads}</TableCell>
              <TableCell className="text-right">{item.schedules}</TableCell>
              <TableCell className="text-right">{item.visits}</TableCell>
              <TableCell className="text-right">{item.sales}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
