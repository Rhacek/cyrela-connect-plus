
import { Image } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-muted-foreground">
      <Image className="h-10 w-10 mb-2" />
      <p>Nenhuma imagem adicionada</p>
      <p className="text-xs mt-1">Arraste imagens aqui ou clique em "Adicionar imagens"</p>
    </div>
  );
};
