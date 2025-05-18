
import { ReactNode, RefObject, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollControlsProps {
  scrollContainerRef: RefObject<HTMLDivElement>;
  children: ReactNode;
  isMobile: boolean;
}

export function ScrollControls({
  scrollContainerRef,
  children,
  isMobile
}: ScrollControlsProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => window.removeEventListener('resize', checkScroll);
  }, [scrollContainerRef]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollDistance = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    
    scrollContainerRef.current.scrollTo({
      left: direction === 'right' ? currentScroll + scrollDistance : currentScroll - scrollDistance,
      behavior: 'smooth'
    });
    
    // Update arrow visibility after scroll
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }, 300);
  };

  return (
    <div className="relative">
      {showLeftArrow && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
          onClick={() => scroll('left')}
        >
          <ChevronLeft size={18} />
        </Button>
      )}
      
      {children}
      
      {showRightArrow && !isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-sm hover:bg-cyrela-gray-lighter"
          onClick={() => scroll('right')}
        >
          <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
}
