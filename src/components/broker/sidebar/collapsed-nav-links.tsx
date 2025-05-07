
import { 
  Home, 
  User, 
  Building, 
  Users, 
  Calendar, 
  BarChart, 
  Share
} from "lucide-react";

export function CollapsedNavLinks() {
  return (
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
  );
}
