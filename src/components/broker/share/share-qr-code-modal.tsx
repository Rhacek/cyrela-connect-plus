
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SharedLink } from "@/types/share";
import { Download, Copy } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface ShareQrCodeModalProps {
  link: SharedLink | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareQrCodeModal({ link, isOpen, onClose }: ShareQrCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const qrCodeRef = useRef<HTMLImageElement>(null);

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
    
    toast.success("QR Code baixado", {
      description: "QR Code salvo em seus downloads"
    });
  };

  const handleCopy = async () => {
    try {
      if (qrCodeRef.current) {
        // Create a canvas and draw the image on it
        const canvas = document.createElement("canvas");
        canvas.width = qrCodeRef.current.width;
        canvas.height = qrCodeRef.current.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(qrCodeRef.current, 0, 0);
          
          // Convert canvas to blob and copy to clipboard
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                await navigator.clipboard.write([
                  new ClipboardItem({
                    [blob.type]: blob
                  })
                ]);
                toast.success("QR Code copiado", {
                  description: "Você pode colar o QR Code em qualquer editor"
                });
              } catch (err) {
                console.error("Failed to copy: ", err);
                fallbackCopy();
              }
            }
          });
        } else {
          fallbackCopy();
        }
      }
    } catch (err) {
      console.error("Copy failed:", err);
      fallbackCopy();
    }
  };

  // Fallback copy method that just copies the URL instead of the image
  const fallbackCopy = () => {
    navigator.clipboard.writeText(link.url);
    toast.success("Link copiado", {
      description: "O link foi copiado para a área de transferência"
    });
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
            <img 
              ref={qrCodeRef}
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-64 h-64 border border-gray-200 rounded-md"
              crossOrigin="anonymous"
            />
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
        
        <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
          <Button type="button" variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button type="button" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copiar
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
