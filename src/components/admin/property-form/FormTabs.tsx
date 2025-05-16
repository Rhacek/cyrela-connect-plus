
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface FormTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

export const FormTabs = ({ currentTab, onTabChange, children }: FormTabsProps) => {
  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-4 w-full max-w-xl px-2 py-2 gap-1 min-h-12 items-center justify-center">
        <TabsTrigger 
          value="basic" 
          className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
        >
          Informações Básicas
        </TabsTrigger>
        <TabsTrigger 
          value="details" 
          className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
        >
          Detalhes
        </TabsTrigger>
        <TabsTrigger 
          value="media" 
          className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
        >
          Mídia
        </TabsTrigger>
        <TabsTrigger 
          value="broker" 
          className="h-full w-full flex items-center justify-center text-center p-2 whitespace-normal text-sm"
        >
          Info. Corretor
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
};
