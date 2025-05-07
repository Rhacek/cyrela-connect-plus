
import { Button } from "@/components/ui/button";
import { MessageSquare, Filter, Phone } from "lucide-react";

interface MobileActionsProps {
  isMobileFilterOpen: boolean;
  onOverlayClick: () => void;
  onFilterClick?: () => void;
  brokerPhone?: string;
}

export function MobileActions({ 
  isMobileFilterOpen, 
  onOverlayClick,
  onFilterClick,
  brokerPhone = "5511987654321" // Default phone number if none provided
}: MobileActionsProps) {
  
  const handleWhatsAppClick = () => {
    // Format phone number for WhatsApp URL by removing any non-digit characters
    const formattedPhone = brokerPhone.replace(/\D/g, "");
    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=Olá, estou interessado em um imóvel da Cyrela. Poderia me ajudar?`;
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };
  
  return (
    <>
      {/* Floating button to contact broker on mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Button
          onClick={handleWhatsAppClick}
          className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white h-14 w-14 flex items-center justify-center"
        >
          <Phone size={24} />
        </Button>
      </div>
      
      {/* Floating button to open filters on mobile */}
      {onFilterClick && (
        <div className="fixed bottom-6 left-6 md:hidden z-30">
          <Button
            onClick={onFilterClick}
            className="rounded-full shadow-lg bg-cyrela-blue hover:bg-cyrela-blue/90 text-white h-14 w-14 flex items-center justify-center"
          >
            <Filter size={24} />
          </Button>
        </div>
      )}
      
      {/* Overlay for mobile filter */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onOverlayClick}
        />
      )}
    </>
  );
}
