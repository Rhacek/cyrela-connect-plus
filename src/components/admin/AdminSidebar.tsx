
import { NavLink } from "react-router-dom";
import { 
  Home, 
  Building, 
  Users, 
  MessageSquare, 
  Settings,
  PieChart
} from "lucide-react";

export const AdminSidebar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <aside className="w-64 border-r bg-card p-4 hidden md:block">
      <div className="flex items-center gap-2 mb-8 px-4">
        <span className="font-bold text-xl text-primary">Cyrela Admin</span>
      </div>
      
      <nav className="space-y-1">
        <NavLink to="/admin" end className={navLinkClass}>
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/admin/properties" className={navLinkClass}>
          <Building size={18} />
          <span>Imóveis</span>
        </NavLink>
        
        <NavLink to="/admin/brokers" className={navLinkClass}>
          <Users size={18} />
          <span>Corretores</span>
        </NavLink>
        
        <NavLink to="/admin/leads" className={navLinkClass}>
          <MessageSquare size={18} />
          <span>Leads</span>
        </NavLink>
        
        <NavLink to="/admin/settings" className={navLinkClass}>
          <Settings size={18} />
          <span>Configurações</span>
        </NavLink>
      </nav>
    </aside>
  );
};
