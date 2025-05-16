
import React from "react";

export function DashboardLoading() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyrela-red"></div>
        <p className="text-cyrela-gray-dark">Verificando sessão e carregando dados...</p>
      </div>
    </div>
  );
}
