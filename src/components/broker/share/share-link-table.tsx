
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SharedLink } from "@/types/share";
import { Copy, QrCode, Share } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { ShareQrCodeModal } from "./share-qr-code-modal";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { User } from "lucide-react";

interface ShareLinkTableProps {
  links: SharedLink[];
}

export function ShareLinkTable({ links }: ShareLinkTableProps) {
  const [selectedLink, setSelectedLink] = useState<SharedLink | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!", {
      description: "Link copiado para a área de transferência"
    });
  };

  const openQrCodeModal = (link: SharedLink) => {
    setSelectedLink(link);
    setIsQrModalOpen(true);
  };

  const formatDate = (date?: string) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getPropertyImage = (link: SharedLink) => {
    if (link.property?.images && link.property.images.length > 0 && link.property.images[0]?.url) {
      return link.property.images[0].url;
    }
    return null;
  }

  const shareLink = (link: SharedLink) => {
    if (navigator.share) {
      navigator.share({
        title: link.property?.title || "Compartilhamento de imóvel",
        text: `Confira este imóvel: ${link.property?.title || ""}`,
        url: link.url,
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
        copyToClipboard(link.url);
      });
    } else {
      copyToClipboard(link.url);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imóvel</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className="hidden md:table-cell">Criado em</TableHead>
              <TableHead className="hidden md:table-cell">Cliques</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id} className={!link.isActive ? "opacity-60" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-sm overflow-hidden bg-cyrela-gray-lighter">
                      <OptimizedImage 
                        src={getPropertyImage(link)} 
                        alt={link.property?.title || "Imóvel"}
                        className="w-full h-full object-cover"
                        fallbackComponent={<div className="w-full h-full flex items-center justify-center">
                          <User size={16} className="text-cyrela-gray-dark" />
                        </div>}
                      />
                    </div>
                    <span className="line-clamp-1">{link.property?.title || "Imóvel"}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[120px] md:max-w-[200px] truncate">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate block"
                  >
                    {link.url}
                  </a>
                </TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(link.createdAt)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <span className="font-medium">{link.clicks}</span>
                    {link.lastClickedAt && (
                      <span className="text-xs text-muted-foreground ml-2">
                        último: {formatDate(link.lastClickedAt)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.url)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Copiar</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openQrCodeModal(link)}>
                      <QrCode className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">QR Code</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => shareLink(link)}>
                      <Share className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:ml-2">Compartilhar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ShareQrCodeModal 
        link={selectedLink}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </>
  );
}
