
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
          count > 0 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
          className
        )}
        onClick={onClick}
      >
        <Filter size={18} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
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
      size={variant === "compact" ? "sm" : "default"}
      className={cn(
        selected 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "default" 
          ? "justify-start text-left h-auto py-1.5 overflow-hidden" 
          : "justify-center h-8",
        className
      )}
      onClick={onClick}
    >
      {selected && variant === "default" && (
        <CheckCheck size={18} className="mr-2 shrink-0" />
      )}
      <span className="truncate">{label}</span>
    </Button>
  );
}
