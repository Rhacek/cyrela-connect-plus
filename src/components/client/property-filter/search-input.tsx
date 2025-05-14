
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

export function SearchInput({ value, onChange, onSearch, className }: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark z-10" size={18} />
      <Input
        placeholder="Buscar por nome ou bairro"
        className="pl-10 py-2 text-sm w-full border-cyrela-gray-lighter focus-visible:ring-cyrela-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
