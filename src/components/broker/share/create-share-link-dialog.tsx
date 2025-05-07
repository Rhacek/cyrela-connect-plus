
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
import { mockProperties } from "@/mocks/property-data";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPropertyId) {
      toast({
        title: "Selecione um imóvel",
        description: "É necessário selecionar um imóvel para gerar o link",
        variant: "destructive",
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
              <Select 
                value={selectedPropertyId} 
                onValueChange={setSelectedPropertyId}
              >
                <SelectTrigger id="property">
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {mockProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button type="submit">Criar link</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
