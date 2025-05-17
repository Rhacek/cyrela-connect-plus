
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc = "/placeholder.svg",
  fallbackComponent,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);
  const [hasError, setHasError] = useState(false);
  
  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    setHasError(true);
  };
  
  if (hasError && fallbackComponent) {
    return <div className={className}>{fallbackComponent}</div>;
  }
  
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
