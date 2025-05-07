
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import { Search, ArrowRight, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BrokerIntroPage = () => {
  const navigate = useNavigate();
  
  // Mock broker data - would come from API/context in a real implementation
  const broker = {
    name: "Ana Silva",
    photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    creci: "154872-F",
    phone: "(11) 98765-4321",
    experience: "5 anos",
    specialties: "Imóveis de alto padrão, Zona Sul",
    bio: "Corretora com mais de 5 anos de experiência no mercado imobiliário de São Paulo, especializada em imóveis de alto padrão na zona sul da cidade. Comprometida em encontrar o imóvel perfeito para cada cliente."
  };

  const handleWhatsAppClick = () => {
    // Format phone number for WhatsApp URL by removing any non-digit characters
    const formattedPhone = broker.phone.replace(/\D/g, "");
    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=Olá, estou interessado em um imóvel da Cyrela. Poderia me ajudar?`;
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-cyrela-gray-dark to-black">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 opacity-40" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }} />
      
      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black to-transparent opacity-70" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div className="flex items-center pl-2">
            <AppLogo variant="full" className="text-white" size="lg" />
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-4xl text-center animate-fade-in">
            <span className="inline-block mb-6 text-cyrela-gray-lightest font-light text-lg md:text-xl">
              Seu corretor especializado estará com você em cada etapa
            </span>
            
            <div className="flex flex-col items-center mb-8">
              <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-lg">
                <AvatarImage src={broker.photo} alt={broker.name} />
                <AvatarFallback className="text-3xl bg-cyrela-red text-white">
                  {broker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-poppins leading-tight">
                {broker.name}
              </h1>
              
              <p className="text-cyrela-gray-lightest mb-2">
                CRECI {broker.creci} • {broker.experience} de experiência
              </p>
              
              <p className="text-cyrela-gray-lightest mb-4">
                Especialista em: {broker.specialties}
              </p>
              
              <div className="max-w-lg text-center">
                <p className="text-white mb-8">
                  {broker.bio}
                </p>
              </div>
              
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full flex items-center gap-2 mt-2 mb-8"
              >
                <Phone size={18} />
                Falar com {broker.name.split(' ')[0]}
              </Button>
            </div>
            
            <Button 
              className="py-6 px-8 text-lg rounded-md bg-cyrela-red hover:bg-cyrela-red/90 transition-all duration-300 transform hover:scale-105" 
              onClick={() => navigate("/client/onboarding")}
            >
              <Search className="mr-2 h-5 w-5" />
              Encontrar meu imóvel
            </Button>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 text-center text-cyrela-gray-lightest/60 text-sm">
          © 2025 Cyrela+. Todos os direitos reservados.
        </footer>
      </div>
      
      {/* Floating WhatsApp button */}
      <div className="fixed bottom-6 right-6 z-30">
        <Button
          onClick={handleWhatsAppClick}
          className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white h-14 w-14 flex items-center justify-center"
        >
          <Phone size={24} />
        </Button>
      </div>
    </div>
  );
};

export default BrokerIntroPage;
