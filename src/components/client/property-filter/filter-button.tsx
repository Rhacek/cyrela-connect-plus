import { Button } from "@/components/ui/button";
import { CheckCheck, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  id?: string;
  label?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "compact";
  count?: number;
}

export function FilterButton({ 
  id, 
  label, 
  selected = false, 
  onClick,
  className,
  variant = "default",
  count
}: FilterButtonProps) {
  // If count is provided, render a filter button with count
  if (count !== undefined) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "relative",
          count > 0 ? "bg-cyrela-blue text-white hover:bg-cyrela-blue/90" : "",
          className
        )}
        onClick={onClick}
      >
        <Filter size={18} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>
    );
  }

  // Otherwise render a regular filter button with label
  return (
    <Button
      key={id}
      variant="outline"
      size="sm"
      className={cn(
        selected 
          ? "bg-cyrela-blue text-white hover:bg-cyrela-blue hover:text-white" 
          : "text-cyrela-gray-dark hover:text-cyrela-gray-dark",
        variant === "default" 
          ? "justify-start text-left text-sm h-auto py-1.5 overflow-hidden" 
          : "justify-center text-sm h-8",
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
