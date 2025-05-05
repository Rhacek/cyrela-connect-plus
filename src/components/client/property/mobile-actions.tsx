
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface MobileActionsProps {
  isMobileFilterOpen: boolean;
  onOverlayClick: () => void;
}

export function MobileActions({ 
  isMobileFilterOpen, 
  onOverlayClick 
}: MobileActionsProps) {
  return (
    <>
      {/* Floating button to contact broker on mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Button
          className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white h-14 w-14 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </Button>
      </div>
      
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
