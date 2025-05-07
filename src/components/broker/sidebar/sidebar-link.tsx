
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

export function SidebarLink({ icon, label, href, isActive }: SidebarLinkProps) {
  return (
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
}
