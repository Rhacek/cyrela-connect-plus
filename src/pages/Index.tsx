
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/app-logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyrela-gray-lightest">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <AppLogo size="lg" />
        
        <div className="mt-16 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-cyrela-blue mb-6">
            Quem oferta mais, vende mais!
          </h1>
          
          <p className="text-xl text-cyrela-gray-dark mb-8">
            Conecte-se com seus clientes de forma personalizada e aumente suas vendas com o Cyrela Connect+, a plataforma exclusiva para corretores do Grupo Cyrela.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <Button
              className="py-6 px-8 text-lg bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
              onClick={() => window.location.href = "/auth"}
            >
              Acessar plataforma
            </Button>
            
            <Button
              variant="outline"
              className="py-6 px-8 text-lg border-cyrela-blue text-cyrela-blue hover:bg-cyrela-gray-lighter"
              onClick={() => window.location.href = "/auth?register=true"}
            >
              Cadastrar-se
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white rounded-lg p-6 shadow-md border border-cyrela-gray-lighter">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyrela-blue bg-opacity-10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyrela-blue">
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12 3 3 5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ofertas personalizadas</h3>
            <p className="text-cyrela-gray-dark">
              Crie links exclusivos para cada cliente com ofertas personalizadas dos empreendimentos Cyrela, Living e Lavvi.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-cyrela-gray-lighter">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyrela-blue bg-opacity-10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyrela-blue">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Métricas de desempenho</h3>
            <p className="text-cyrela-gray-dark">
              Acompanhe seus KPIs, gerencie seus leads e melhore sua taxa de conversão com dados em tempo real.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md border border-cyrela-gray-lighter">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyrela-blue bg-opacity-10 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyrela-blue">
                <path d="M17 6.1H3" />
                <path d="M21 12.1H3" />
                <path d="M15.1 18H3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Experiência digital</h3>
            <p className="text-cyrela-gray-dark">
              Ofereça uma experiência digital premium aos seus clientes, alinhada aos valores de qualidade do Grupo Cyrela.
            </p>
          </div>
        </div>
        
        <div className="mt-20 bg-white rounded-lg p-8 shadow-md border border-cyrela-gray-lighter w-full max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-cyrela-blue mb-4">
              Como funciona
            </h2>
            <p className="text-cyrela-gray-dark max-w-3xl mx-auto">
              Aumente suas vendas em 3 passos simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyrela-blue text-white font-bold text-2xl mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Cadastre-se</h3>
              <p className="text-cyrela-gray-dark">
                Crie sua conta na plataforma e configure seu perfil profissional.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyrela-blue text-white font-bold text-2xl mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Compartilhe</h3>
              <p className="text-cyrela-gray-dark">
                Gere links personalizados e compartilhe com seus potenciais clientes.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cyrela-blue text-white font-bold text-2xl mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Converta</h3>
              <p className="text-cyrela-gray-dark">
                Acompanhe seus leads e aumente suas chances de fechar negócios.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl font-medium text-cyrela-blue mb-4">
            Pronto para vender mais?
          </p>
          
          <Button
            className="py-6 px-8 text-lg bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
            onClick={() => window.location.href = "/auth"}
          >
            Começar agora
          </Button>
        </div>
      </div>
      
      <footer className="mt-20 bg-cyrela-gray-lightest py-8 border-t border-cyrela-gray-lighter">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <AppLogo />
            
            <div className="mt-4 md:mt-0">
              <p className="text-cyrela-gray-dark text-sm">
                © {new Date().getFullYear()} Cyrela. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
