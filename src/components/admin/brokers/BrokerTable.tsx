
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Broker } from "@/services/brokers.service";
import { BrokerRow } from "./BrokerRow";

interface BrokerTableProps {
  brokers: Broker[];
  deletingId: string | null;
  onDeleteBroker: (id: string) => Promise<void>;
}

export const BrokerTable = ({ brokers, deletingId, onDeleteBroker }: BrokerTableProps) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Código</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Imóveis</TableHead>
          <TableHead>Clientes</TableHead>
          <TableHead className="w-[80px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brokers.map((broker) => (
          <BrokerRow 
            key={broker.id}
            broker={broker}
            isDeleting={deletingId === broker.id}
            onDelete={onDeleteBroker}
          />
        ))}
      </TableBody>
    </Table>
  );
};
