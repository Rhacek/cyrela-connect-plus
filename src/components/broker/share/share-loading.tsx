
import React from "react";

interface ShareLoadingProps {
  message?: string;
}

export function ShareLoading({ message = "Carregando..." }: ShareLoadingProps) {
  return (
    <div className="cyrela-card p-6 flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
        <p className="mt-2 text-cyrela-gray-dark">{message}</p>
      </div>
    </div>
  );
}
