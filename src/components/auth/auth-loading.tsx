
import React from "react";

export const AuthLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrela-red"></div>
        <p className="text-cyrela-gray-dark">Verificando autenticação...</p>
      </div>
    </div>
  );
};
