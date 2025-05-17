
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/broker/profile/profile-header";
import { ProfileImageUpload } from "@/components/broker/profile/profile-image-upload";
import { ProfileForm } from "@/components/broker/profile/profile-form";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/auth-context";
import { brokerService, BrokerProfile } from "@/services/broker.service";

const BrokerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const brokerId = session?.id;
  
  // Fetch broker profile data from Supabase
  const { 
    data: profileData,
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['brokerProfile', brokerId],
    queryFn: () => brokerService.getBrokerProfile(brokerId || ""),
    enabled: !!brokerId
  });
  
  // Mutation for updating profile data
  const updateProfile = useMutation({
    mutationFn: (data: typeof profileData) => {
      if (!brokerId || !data) return Promise.resolve(false);
      return brokerService.updateBrokerProfile(brokerId, data);
    },
    onSuccess: (success) => {
      if (success) {
        toast.success("Perfil atualizado com sucesso!");
        setIsEditing(false);
        refetch();
      } else {
        toast.error("Erro ao atualizar perfil");
      }
    },
    onError: (err) => {
      console.error("Error updating profile:", err);
      toast.error("Erro ao atualizar perfil");
    }
  });
  
  // Show error toast if data fetch fails
  useEffect(() => {
    if (error) {
      console.error("Error fetching profile:", error);
      toast.error("Não foi possível carregar os dados do perfil");
    }
  }, [error]);
  
  const handleEditStart = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setProfileImage(null);
  };
  
  const handleProfileFormSubmit = (data: typeof profileData) => {
    if (!data) return;
    
    // Here you would normally upload the image first, then update the profile
    // For this implementation, we'll just update the profile data
    updateProfile.mutate(data);
  };
  
  const handleImageChange = (image: File | null) => {
    setProfileImage(image);
  };
  
  const handleSave = () => {
    // Trigger the form submission
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    document.querySelector('form')?.dispatchEvent(submitEvent);
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyrela-blue mx-auto"></div>
          <p className="mt-2 text-cyrela-gray-dark">Carregando perfil...</p>
        </div>
      </div>
    );
  }
  
  // If no profile data, show empty state with minimal profile
  const emptyProfile = {
    name: session?.user_metadata?.name || "",
    email: session?.email || "",
    phone: "",
    registryNumber: "",
    bio: "",
    specialties: "",
    experience: "",
    address: ""
  };
  
  const displayProfileData = profileData || emptyProfile;
  
  return (
    <div className="w-full">
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
            currentImage={profileData?.profileImage} 
            isEditing={isEditing}
            onImageChange={handleImageChange}
            className="sm:w-40 sm:flex-shrink-0"
          />
          
          <div className="w-full">
            <h2 className="text-xl font-semibold text-cyrela-blue mb-2 text-center sm:text-left">
              {displayProfileData.name}
            </h2>
            
            <p className="text-cyrela-gray-dark text-center sm:text-left">
              Corretor de Imóveis {displayProfileData.registryNumber ? `• CRECI ${displayProfileData.registryNumber}` : ""}
            </p>
            
            {!isEditing && !isMobile && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-cyrela-gray-dark font-medium">Email</p>
                  <p className="text-sm">{displayProfileData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-cyrela-gray-dark font-medium">Telefone</p>
                  <p className="text-sm">{displayProfileData.phone || "Não informado"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <ProfileForm 
          initialData={displayProfileData}
          isEditing={isEditing}
          onSubmit={handleProfileFormSubmit}
        />
      </div>
    </div>
  );
}

export default BrokerProfile;
