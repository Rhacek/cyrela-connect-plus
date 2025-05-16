
import { Loader2 } from "lucide-react";

export const PropertyFormLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
      <p className="text-muted-foreground">Carregando informações do imóvel...</p>
    </div>
  );
};
