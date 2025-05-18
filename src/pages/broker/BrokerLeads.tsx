
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { LeadsHeader } from "@/components/broker/leads/leads-header";
import { LeadsFilter } from "@/components/broker/leads/leads-filter";
import { LeadsTable } from "@/components/broker/leads/leads-table";
import { LeadsList } from "@/components/broker/leads/leads-list";
import { Lead, LeadStatus } from "@/types";
import { useAuth } from "@/context/auth-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useLeadsData } from "@/hooks/dashboard/use-leads-data";

export default function BrokerLeads() {
  const { session } = useAuth();
  const brokerId = session?.id;
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Use URL search params to persist filters
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL or use defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">(
    (searchParams.get("status") as LeadStatus | "ALL") || "ALL"
  );
  
  // Date filters
  const [fromDate, setFromDate] = useState<Date | undefined>(
    searchParams.get("fromDate") ? new Date(searchParams.get("fromDate")!) : undefined
  );
  const [toDate, setToDate] = useState<Date | undefined>(
    searchParams.get("toDate") ? new Date(searchParams.get("toDate")!) : undefined
  );
  
  // Fetch leads data with filters
  const { 
    recentLeads: leads,
    isLoadingLeads: isLoading, 
    refetchLeads: refetch
  } = useLeadsData(
    brokerId, 
    true,
    {
      name: searchTerm,
      status: statusFilter,
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString()
    }
  );
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (fromDate) params.set("fromDate", fromDate.toISOString());
    if (toDate) params.set("toDate", toDate.toISOString());
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, statusFilter, fromDate, toDate, setSearchParams]);
  
  // Handle search term change
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Handle status filter change
  const handleStatusFilter = (status: LeadStatus | "ALL") => {
    setStatusFilter(status);
  };
  
  // Handle date filter changes
  const handleFromDateChange = (date: Date | undefined) => {
    setFromDate(date);
  };
  
  const handleToDateChange = (date: Date | undefined) => {
    setToDate(date);
  };
  
  const handleClearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  const handleLeadCreated = () => {
    refetch();
  };

  return (
    <div className="w-full">
      <LeadsHeader onLeadCreated={handleLeadCreated} />
      
      <LeadsFilter 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        fromDate={fromDate}
        toDate={toDate}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusFilter}
        onFromDateChange={handleFromDateChange}
        onToDateChange={handleToDateChange}
        onClearDateFilters={handleClearDateFilters}
      />
      
      {isLoading ? (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
            <p className="mt-2 text-cyrela-gray-dark">Carregando leads...</p>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div className="w-full bg-white rounded-lg shadow-sm border border-cyrela-gray-lighter p-8 text-center">
          <p className="text-cyrela-gray-dark">Nenhum lead encontrado com os filtros aplicados.</p>
        </div>
      ) : isMobile ? (
        <LeadsList leads={leads} />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
