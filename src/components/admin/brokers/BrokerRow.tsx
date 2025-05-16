
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Broker } from "@/services/brokers.service";
import { BrokerActionMenu } from "./BrokerActionMenu";

interface BrokerRowProps {
  broker: Broker;
  isDeleting: boolean;
  onDelete: (id: string) => Promise<void>;
}

export const BrokerRow = ({ broker, isDeleting, onDelete }: BrokerRowProps) => {
  return (
    <TableRow key={broker.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {broker.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{broker.name}</p>
            <p className="text-xs text-muted-foreground">{broker.brokerage || "Sem imobiliária"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{broker.brokerCode || "N/A"}</TableCell>
      <TableCell>
        <div>
          <p>{broker.email}</p>
          <p className="text-xs text-muted-foreground">{broker.phone || "Sem telefone"}</p>
        </div>
      </TableCell>
      <TableCell>
        {broker.status === "active" ? (
          <Badge className="bg-success">Ativo</Badge>
        ) : (
          <Badge variant="outline">Inativo</Badge>
        )}
      </TableCell>
      <TableCell>{broker.properties}</TableCell>
      <TableCell>{broker.clients}</TableCell>
      <TableCell>
        <BrokerActionMenu 
          brokerId={broker.id}
          brokerName={broker.name}
          isDeleting={isDeleting === broker.id}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
