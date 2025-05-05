
import { useState, useEffect } from "react";
import { 
  Home, 
  User, 
  Building, 
  Users, 
  Calendar, 
  BarChart, 
  Share, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface BrokerSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const SidebarLink = ({ icon, label, href, isActive }: SidebarLinkProps) => (
  <a
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-cyrela-gray-lighter",
      isActive && "bg-primary text-white hover:bg-primary hover:bg-opacity-90"
    )}
  >
    <div className="text-lg">{icon}</div>
    <span className="font-inter">{label}</span>
  </a>
);

export function BrokerSidebar({ collapsed = false, setCollapsed }: BrokerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  useEffect(() => {
    if (collapsed !== undefined && collapsed !== isCollapsed) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (setCollapsed) {
      setCollapsed(newState);
    }
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-cyrela-gray-light transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex items-center p-4 border-b border-cyrela-gray-light">
        {isCollapsed ? (
          <AppLogo variant="icon" className="mx-auto" />
        ) : (
          <AppLogo />
        )}
        
        <button 
          className={cn(
            "ml-auto text-cyrela-gray-dark hover:text-primary",
            !isCollapsed ? "block" : "hidden"
          )}
          onClick={handleToggleCollapse}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="space-y-1 px-3">
          {isCollapsed ? (
            <>
              <div className="flex justify-center mb-6">
                <a href="/broker/dashboard" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <Home size={24} className="text-primary" />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/profile" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <User size={24} />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/properties" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <Building size={24} />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/leads" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <Users size={24} />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/schedule" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <Calendar size={24} />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/metrics" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <BarChart size={24} />
                </a>
              </div>
              <div className="flex justify-center mb-6">
                <a href="/broker/share" className="p-3 hover:bg-cyrela-gray-lighter rounded-full">
                  <Share size={24} />
                </a>
              </div>
            </>
          ) : (
            <>
              <SidebarLink 
                icon={<Home />} 
                label="Dashboard" 
                href="/broker/dashboard" 
                isActive={true}
              />
              <SidebarLink 
                icon={<User />} 
                label="Meu perfil" 
                href="/broker/profile" 
              />
              <SidebarLink 
                icon={<Building />} 
                label="Imóveis" 
                href="/broker/properties" 
              />
              <SidebarLink 
                icon={<Users />} 
                label="Leads" 
                href="/broker/leads" 
              />
              <SidebarLink 
                icon={<Calendar />} 
                label="Agenda" 
                href="/broker/schedule" 
              />
              <SidebarLink 
                icon={<BarChart />} 
                label="Desempenho" 
                href="/broker/metrics" 
              />
              <SidebarLink 
                icon={<Share />} 
                label="Compartilhar" 
                href="/broker/share" 
              />
            </>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-cyrela-gray-light">
        {!isCollapsed && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-cyrela-gray-lighter flex items-center justify-center">
              <User size={20} className="text-cyrela-gray-dark" />
            </div>
            <div>
              <p className="font-medium text-sm font-poppins">Ana Silva</p>
              <p className="text-xs text-cyrela-gray-dark font-inter">Corretor PRO</p>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          {isCollapsed ? (
            <a href="/settings" className="block p-3 hover:bg-cyrela-gray-lighter rounded-full mx-auto w-fit">
              <Settings size={20} className="text-cyrela-gray-dark" />
            </a>
          ) : (
            <SidebarLink 
              icon={<Settings size={18} />} 
              label="Configurações" 
              href="/settings" 
            />
          )}
        </div>
        
        <div className="mt-4">
          <button
            onClick={handleToggleCollapse}
            className={cn(
              "flex items-center justify-center w-full py-2 text-sm text-cyrela-gray-dark hover:text-primary font-inter",
              isCollapsed ? "mx-auto" : ""
            )}
          >
            {isCollapsed ? (
              <Menu size={20} />
            ) : (
              <span>Recolher</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
