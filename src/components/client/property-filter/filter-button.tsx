
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
  variant?: "default" | "compact";
}

export function FilterButton({ 
  id, 
  label, 
  selected, 
  onClick,
  className,
  variant = "default"
}: FilterButtonProps) {
  return (
    <Button
      key={id}
      variant="outline"
      size="sm"
      className={cn(
        variant === "default" 
          ? "justify-start text-left text-sm h-auto py-1.5 overflow-hidden" 
          : "justify-center p-1 text-sm h-8",
        !selected && "text-cyrela-gray-dark hover:text-cyrela-gray-dark",
        selected && "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white",
        className
      )}
      onClick={onClick}
    >
      {selected && variant === "default" && (
        <CheckCheck size={16} className="mr-2 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </Button>
  );
}
