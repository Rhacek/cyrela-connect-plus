
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";
import { Search } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();
  
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
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-4xl text-center animate-fade-in">
            <span className="inline-block mb-6 text-cyrela-gray-lightest font-light text-lg md:text-xl">
              O lugar perfeito para você viver seus melhores momentos
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-poppins leading-tight">
              Encontre seu novo<br />apartamento <span className="text-cyrela-red">Cyrela</span>
            </h1>
            
            <p className="text-lg md:text-xl text-cyrela-gray-lightest mb-10 max-w-3xl mx-auto">
              São Paulo, alto padrão, novos ou em construção
            </p>
            
            <Button className="py-6 px-8 text-lg rounded-md bg-cyrela-red hover:bg-cyrela-red/90 transition-all duration-300 transform hover:scale-105" 
                   onClick={() => navigate("/client/broker")}>
              <Search className="mr-2 h-5 w-5" />
              Buscar imóveis
            </Button>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-6 text-center text-cyrela-gray-lightest/60 text-sm">
          © 2025 Cyrela+. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
