
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark z-10" size={18} />
      <Input
        placeholder="Buscar por nome ou bairro"
        className="pl-10 py-2 text-sm w-full border-cyrela-gray-lighter focus-visible:ring-cyrela-blue"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
