
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { propertiesService } from "@/services/properties.service";
import { Property } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface CreateShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLink: (propertyId: string, notes?: string) => void;
}

export function CreateShareLinkDialog({ 
  isOpen, 
  onClose, 
  onCreateLink 
}: CreateShareLinkDialogProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch properties from API instead of using mock data
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => await propertiesService.getAllActiveProperties(),
    enabled: isOpen // Only fetch when dialog is open
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPropertyId) {
      toast.error("Selecione um imóvel", {
        description: "É necessário selecionar um imóvel para gerar o link"
      });
      return;
    }
    
    onCreateLink(selectedPropertyId, notes);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPropertyId("");
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar novo link</DialogTitle>
            <DialogDescription>
              Gere um link personalizado para compartilhar com seus clientes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Imóvel</Label>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select 
                  value={selectedPropertyId} 
                  onValueChange={setSelectedPropertyId}
                >
                  <SelectTrigger id="property">
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property: Property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione informações sobre este compartilhamento"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              Criar link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
