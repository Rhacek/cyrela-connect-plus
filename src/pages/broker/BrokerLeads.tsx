
import { useState } from "react";
import { LeadsHeader } from "@/components/broker/leads/leads-header";
import { LeadsFilter } from "@/components/broker/leads/leads-filter";
import { LeadsTable } from "@/components/broker/leads/leads-table";
import { mockLeads } from "@/mocks/lead-data";
import { Lead, LeadStatus } from "@/types";

export default function BrokerLeads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  
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

  return (
    <div className="w-full">
      <LeadsHeader 
        onAddLeadClick={() => console.log("Add new lead")} 
      />
      
      <LeadsFilter 
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={handleSearch}
        onStatusChange={handleStatusFilter}
      />
      
      <LeadsTable leads={filteredLeads} />
    </div>
  );
}
