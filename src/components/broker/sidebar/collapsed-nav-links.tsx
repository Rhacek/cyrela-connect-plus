
import { 
  Home, 
  User, 
  Building, 
  Users, 
  Calendar, 
  BarChart, 
  Share
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsedNavLinksProps {
  currentPath: string;
}

export function CollapsedNavLinks({ currentPath }: CollapsedNavLinksProps) {
  const routes = [
    { path: "/broker/dashboard", icon: Home },
    { path: "/broker/profile", icon: User },
    { path: "/broker/properties", icon: Building },
    { path: "/broker/leads", icon: Users },
    { path: "/broker/schedule", icon: Calendar },
    { path: "/broker/metrics", icon: BarChart },
    { path: "/broker/share", icon: Share }
  ];

  return (
    <>
      {routes.map((route) => (
        <div key={route.path} className="flex justify-center mb-6">
          <a 
            href={route.path} 
            className={cn(
              "p-3 hover:bg-cyrela-gray-lighter rounded-full",
              currentPath === route.path ? "bg-primary text-white hover:bg-primary hover:bg-opacity-90" : ""
            )}
          >
            <route.icon size={24} className={currentPath === route.path ? "text-white" : currentPath === "/broker/dashboard" && route.path === "/broker/dashboard" ? "text-primary" : ""} />
          </a>
        </div>
      ))}
    </>
  );
}
