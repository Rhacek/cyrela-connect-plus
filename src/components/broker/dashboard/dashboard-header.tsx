
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
}

export function DashboardHeader({
  title,
  description,
  buttonLabel,
  onButtonClick
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="max-w-2xl">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-cyrela-blue truncate">{title}</h1>
        <p className="text-cyrela-gray-dark text-xs sm:text-sm md:text-base line-clamp-2">
          {description}
        </p>
      </div>
      
      <Button 
        className="bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white whitespace-nowrap self-start sm:self-center text-xs sm:text-sm py-1.5 px-3 h-auto"
        onClick={onButtonClick}
      >
        <Plus size={14} className="sm:size-16 mr-1.5 sm:mr-2" />
        {buttonLabel}
      </Button>
    </div>
  );
}
