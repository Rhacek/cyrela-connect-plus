
import { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterSectionProps {
  title: string;
  icon?: ReactNode;
  isExpanded: boolean;
  onToggleExpand: (expanded: boolean) => void;
  children: ReactNode;
}

export function FilterSection({
  title,
  icon,
  isExpanded,
  onToggleExpand,
  children
}: FilterSectionProps) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggleExpand} className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-none font-medium text-sm text-cyrela-gray-dark flex items-center">
          {icon}
          {title}
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
