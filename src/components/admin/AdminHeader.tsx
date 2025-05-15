
import { useState } from "react";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";

export const AdminHeader = () => {
  const { state, toggle } = useSidebar();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="border-b bg-card py-3 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </Button>
      </div>

      <div className="flex-1 md:flex-initial" />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="User menu">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
