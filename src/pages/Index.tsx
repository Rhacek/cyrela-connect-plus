
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AppLogo } from "@/components/ui/app-logo";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-cyrela-gray-lightest flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <AppLogo size="lg" />
        <h1 className="text-3xl font-bold text-cyrela-red font-poppins text-center">
          Bem-vindo ao Cyrela Connect+
        </h1>
        <p className="text-lg text-cyrela-gray-dark font-inter text-center max-w-lg">
          A plataforma que conecta corretores e clientes para uma experiência imobiliária superior
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="default" className="px-6">
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    </div>
  );
};

export default IndexPage;
