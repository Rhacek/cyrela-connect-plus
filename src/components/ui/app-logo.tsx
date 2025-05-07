
import React from "react";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg";
}

export function AppLogo({
  className,
  variant = "full",
  size = "md"
}: AppLogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      {variant === "full" ? (
        <div className="flex flex-row items-center">
          <div 
            className={cn("text-cyrela-red font-bold font-poppins", {
              "text-xl": size === "sm",
              "text-2xl": size === "md",
              "text-3xl": size === "lg"
            })}
          >
            Cyrela<span className="text-living-gold">+</span>
          </div>
        </div>
      ) : (
        <div 
          className={cn("flex items-center justify-center bg-cyrela-red text-white rounded-md font-poppins", {
            "w-8 h-8": size === "sm",
            "w-10 h-10": size === "md",
            "w-12 h-12": size === "lg"
          })}
        >
          <span className="font-bold">C</span>
          <span className="text-living-gold font-bold">+</span>
        </div>
      )}
    </div>
  );
}
