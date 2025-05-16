
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function AdminHeader() {
  const sidebar = useSidebar();
  const isCollapsed = sidebar.state === "collapsed";
  const { setSession, session } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      console.log("Starting sign out process");
      
      // First clear session in the auth context to prevent redirection issues
      setSession(null);
      
      // Then perform Supabase signout
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Erro ao sair', {
          description: error.message,
        });
        return;
      }
      
      toast.success('Você saiu com sucesso');
      
      // Force redirect to login page
      console.log("Sign out successful, redirecting to login page");
      navigate("/auth", { replace: true });
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erro ao sair');
    }
  };

  const userName = session?.user_metadata?.name || 'Admin';
  const userEmail = session?.email || 'admin@example.com';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="flex h-16 px-4 items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2" 
            onClick={() => isCollapsed ? sidebar.setOpen(true) : sidebar.setOpen(false)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/admin/" className="flex items-center text-xl font-semibold">
            Admin Portal
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt={userName} />
                  <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/admin/settings" className="w-full">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
