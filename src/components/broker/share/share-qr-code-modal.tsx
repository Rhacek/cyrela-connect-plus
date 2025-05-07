
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SharedLink } from "@/mocks/share-data";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareQrCodeModalProps {
  link: SharedLink | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareQrCodeModal({ link, isOpen, onClose }: ShareQrCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (link && isOpen) {
      // Encode the URL for the Google Charts API
      const encodedUrl = encodeURIComponent(link.url);
      setQrCodeUrl(
        `https://chart.googleapis.com/chart?cht=qr&chl=${encodedUrl}&chs=300x300&choe=UTF-8&chld=L|2`
      );
    }
  }, [link, isOpen]);

  if (!link) return null;

  const handleDownload = () => {
    // Create a link element
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeUrl;
    downloadLink.download = `qrcode-${link.code}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code para {link.property?.title || "Imóvel"}</DialogTitle>
          <DialogDescription>
            Use este QR Code para compartilhar o link com seus clientes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center p-4">
          {qrCodeUrl && (
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
          )}
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p className="font-medium">Link:</p>
          <a 
            href={link.url} 
            target="_blank" 
            rel="noreferrer"
            className="text-primary hover:underline truncate block"
          >
            {link.url}
          </a>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button type="button" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
