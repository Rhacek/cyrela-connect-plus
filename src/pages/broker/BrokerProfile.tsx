
import { useState } from "react";
import { toast } from "sonner";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider, 
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  useSidebar
} from "@/components/ui/sidebar";
import { ProfileHeader } from "@/components/broker/profile/profile-header";
import { ProfileImageUpload } from "@/components/broker/profile/profile-image-upload";
import { ProfileForm } from "@/components/broker/profile/profile-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarNavigation } from "@/components/broker/sidebar/sidebar-navigation";
import { SidebarFooter as BrokerSidebarFooter } from "@/components/broker/sidebar/sidebar-footer";
import { SidebarLogo } from "@/components/broker/sidebar/sidebar-logo";

// Mock initial profile data
const mockProfileData = {
  name: "Ana Silva",
  email: "ana.silva@cyrela.com.br",
  phone: "(11) 98765-4321",
  registryNumber: "154872-F",
  bio: "Corretora com mais de 5 anos de experiência no mercado imobiliário de São Paulo, especializada em imóveis de alto padrão na zona sul da cidade. Comprometida em encontrar o imóvel perfeito para cada cliente.",
  specialties: "Imóveis de alto padrão, Zona Sul",
  experience: "5 anos",
  address: "Av. Paulista, 1000, São Paulo - SP",
};

const BrokerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(mockProfileData);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const isMobile = useIsMobile();
  
  const handleEditStart = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes made during editing
  };
  
  const handleProfileFormSubmit = (data: typeof mockProfileData) => {
    setProfileData(data);
    setIsEditing(false);
    
    // Here you would normally save the changes to a backend
    console.log("Profile data updated:", data);
    console.log("Profile image:", profileImage);
    
    toast.success("Perfil atualizado com sucesso!");
  };
  
  const handleImageChange = (image: File | null) => {
    setProfileImage(image);
  };
  
  const handleSave = () => {
    // Trigger the form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    document.querySelector('form')?.dispatchEvent(submitEvent);
  };
  
  // Renamed from SidebarContent to BrokerSidebarContent to avoid conflict
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
  
  return (
    <SidebarProvider>
      {({ state, toggleSidebar }) => (
        <div className="flex h-screen w-full overflow-hidden bg-cyrela-gray-lightest">
          <Sidebar>
            <BrokerSidebarContent />
          </Sidebar>
          
          <SidebarInset>
            <div className="flex flex-col h-full w-full p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
              <ProfileHeader 
                title="Meu Perfil" 
                description="Gerencie suas informações pessoais e profissionais"
                isEditing={isEditing}
                onEdit={handleEditStart}
                onSave={handleSave}
                onCancel={handleCancel}
              />
              
              <div className="grid grid-cols-1 gap-6 w-full">
                <div className="cyrela-card p-6 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <ProfileImageUpload 
                    currentImage={undefined} 
                    isEditing={isEditing}
                    onImageChange={handleImageChange}
                    className="sm:w-40 sm:flex-shrink-0"
                  />
                  
                  <div className="w-full">
                    <h2 className="text-xl font-semibold text-cyrela-blue mb-2 text-center sm:text-left">
                      {profileData.name}
                    </h2>
                    
                    <p className="text-cyrela-gray-dark text-center sm:text-left">
                      Corretor de Imóveis • CRECI {profileData.registryNumber}
                    </p>
                    
                    {!isEditing && !isMobile && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-cyrela-gray-dark font-medium">Email</p>
                          <p className="text-sm">{profileData.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cyrela-gray-dark font-medium">Telefone</p>
                          <p className="text-sm">{profileData.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <ProfileForm 
                  initialData={profileData}
                  isEditing={isEditing}
                  onSubmit={handleProfileFormSubmit}
                />
              </div>
            </div>
          </SidebarInset>
        </div>
      )}
    </SidebarProvider>
  );
};

export default BrokerProfile;
