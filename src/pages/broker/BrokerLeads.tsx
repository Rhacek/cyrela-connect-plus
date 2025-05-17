
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { LeadsHeader } from "@/components/broker/leads/leads-header";
import { LeadsFilter } from "@/components/broker/leads/leads-filter";
import { LeadsTable } from "@/components/broker/leads/leads-table";
import { LeadsList } from "@/components/broker/leads/leads-list";
import { Lead, LeadStatus } from "@/types";
import { useAuth } from "@/context/auth-context";
import { leadsService } from "@/services/leads.service";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function BrokerLeads() {
  const { session } = useAuth();
  const brokerId = session?.id;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  
  // Fetch leads data from Supabase
  const { 
    data: leads = [],
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['brokerLeads', brokerId],
    queryFn: () => leadsService.getBrokerLeads(brokerId || ""),
    enabled: !!brokerId
  });
  
  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      console.error("Error fetching leads:", error);
      toast.error("Não foi possível carregar os leads");
    }
  }, [error]);
  
  // Filter leads based on search term and status filter
  const filteredLeads = leads.filter(lead => {
    // Apply text search
    const matchesSearch = searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (status: LeadStatus | "ALL") => {
    setStatusFilter(status);
  };

  const handleAddLeadClick = () => {
    // This will be implemented in the future
    console.log("Add new lead");
  };

  return (
    <div className="w-full">
      <LeadsHeader onAddLeadClick={handleAddLeadClick} />
      
      <LeadsFilter 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusFilter}
      />
      
      {isLoading ? (
        <div className="w-full flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
            <p className="mt-2 text-cyrela-gray-dark">Carregando leads...</p>
          </div>
        </div>
      ) : isMobile ? (
        <LeadsList leads={filteredLeads} />
      ) : (
        <LeadsTable leads={filteredLeads} />
      )}
    </div>
  );
}
