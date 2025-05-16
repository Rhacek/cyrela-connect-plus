
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BrokerSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const BrokerSearchBar = ({ searchQuery, onSearchChange }: BrokerSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar corretores..."
        className="pl-8 w-full"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
