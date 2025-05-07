
import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider, 
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  useSidebar
} from "@/components/ui/sidebar";
import { LeadsHeader } from "@/components/broker/leads/leads-header";
import { LeadsFilter } from "@/components/broker/leads/leads-filter";
import { LeadsTable } from "@/components/broker/leads/leads-table";
import { SidebarNavigation } from "@/components/broker/sidebar/sidebar-navigation";
import { SidebarFooter as BrokerSidebarFooter } from "@/components/broker/sidebar/sidebar-footer";
import { SidebarLogo } from "@/components/broker/sidebar/sidebar-logo";
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

  // Sidebar content component (reusing pattern from BrokerProperties)
  const BrokerSidebarContent = () => {
    const { state, toggleSidebar } = useSidebar();
    const isCollapsed = state === "collapsed";
    
    return (
      <>
        <SidebarHeader>
          <SidebarLogo 
            isCollapsed={isCollapsed} 
            handleToggleCollapse={toggleSidebar} 
          />
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNavigation isCollapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter>
          <BrokerSidebarFooter 
            isCollapsed={isCollapsed} 
            handleToggleCollapse={toggleSidebar} 
          />
        </SidebarFooter>
      </>
    );
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (status: LeadStatus | "ALL") => {
    setStatusFilter(status);
  };

  return (
    <SidebarProvider>
      {({ state }) => (
        <div className="flex h-screen w-full overflow-hidden bg-cyrela-gray-lightest">
          <Sidebar>
            <BrokerSidebarContent />
          </Sidebar>
          
          <SidebarInset>
            <div className="flex flex-col h-full w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
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
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
}
