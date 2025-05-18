
import { useState } from "react";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Heart, MessageSquare, Share, QrCode, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PropertyActionsProps {
  property: Property;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleScheduleVisit = () => {
    navigate(`/client/schedule/${property.id}`);
  };

  const handleContactBroker = () => {
    // For now just show a toast, later we can implement a contact form
    toast.success("Contato iniciado", {
      description: "Um corretor entrará em contato com você em breve."
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos", {
      description: isFavorite 
        ? "O imóvel foi removido da sua lista de favoritos" 
        : "O imóvel foi adicionado à sua lista de favoritos"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira este imóvel: ${property.title}`,
        url: window.location.href,
      })
      .catch(() => {
        toast.success("Link copiado", {
          description: "O link do imóvel foi copiado para a área de transferência"
        });
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      toast.success("Link copiado", {
        description: "O link do imóvel foi copiado para a área de transferência"
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleShowQrCode = () => {
    const propertyUrl = window.location.href;
    const encodedUrl = encodeURIComponent(propertyUrl);
    setQrCodeUrl(
      `https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=300x300&choe=UTF-8&chld=L|2`
    );
    setIsQrModalOpen(true);
  };

  const handleDownloadQr = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeUrl;
    downloadLink.download = `qrcode-${property.id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success("QR Code baixado", {
      description: "QR Code salvo em seus downloads"
    });
  };

  return (
    <>
      <Card className="sticky top-4">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleScheduleVisit}
            >
              <CalendarClock className="mr-2" size={18} />
              Agendar visita
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleContactBroker}
            >
              <MessageSquare className="mr-2" size={18} />
              Falar com corretor
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className={isFavorite ? "bg-pink-50 text-pink-600 border-pink-200" : ""}
                onClick={handleToggleFavorite}
              >
                <Heart 
                  className={`mr-2 ${isFavorite ? "fill-pink-600 text-pink-600" : ""}`} 
                  size={18} 
                />
                {isFavorite ? "Salvo" : "Salvar"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShare}
              >
                <Share className="mr-2" size={18} />
                Compartilhar
              </Button>
            </div>

            <Button 
              variant="outline"
              className="w-full" 
              onClick={handleShowQrCode}
            >
              <QrCode className="mr-2" size={18} />
              Ver QR Code
            </Button>
            
            <div className="text-sm text-cyrela-gray-medium mt-4 p-3 bg-cyrela-gray-lightest rounded-md">
              <p className="font-medium text-cyrela-gray-dark mb-1">Corretor Exclusivo</p>
              <p>João Silva</p>
              <p>CRECI 123456</p>
              <p>joao.silva@cyrela.com.br</p>
              <p>(11) 98765-4321</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code para {property.title}</DialogTitle>
            <DialogDescription>
              Escaneie este QR Code para acessar o imóvel
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-4">
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-64 h-64 border border-gray-200 rounded-md" 
              />
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium">Link:</p>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noreferrer"
              className="text-primary hover:underline truncate block"
            >
              {window.location.href}
            </a>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button type="button" variant="outline" onClick={() => setIsQrModalOpen(false)}>
              Fechar
            </Button>
            <Button type="button" onClick={handleDownloadQr}>
              <Download className="mr-2 h-4 w-4" />
              Baixar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
