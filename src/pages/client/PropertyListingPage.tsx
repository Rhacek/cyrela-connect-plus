
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/broker/dashboard/property-card";
import { PropertyFilter } from "@/components/client/property-filter";
import { AppLogo } from "@/components/ui/app-logo";
import { Search, X, Menu, Filter, Share, Phone, MessageSquare } from "lucide-react";
import { PropertyStatus } from "@/types";

const PropertyListingPage = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Mock data for properties
  const mockProperties = [
    {
      id: "1",
      title: "Cyrela Iconyc Santos",
      description: "Apartamento de luxo na Beira-Mar",
      type: "Apartamento",
      status: PropertyStatus.AVAILABLE,
      price: 1850000,
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parkingSpaces: 2,
      address: "Av. Presidente Wilson, 1000",
      neighborhood: "Marapé",
      city: "Santos",
      state: "SP",
      zipCode: "11065-200",
      latitude: -23.967181,
      longitude: -46.333380,
      constructionStage: "Em construção",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "1",
      isActive: true,
      isHighlighted: true,
      viewCount: 120,
      shareCount: 35,
      images: [
        {
          id: "1",
          propertyId: "1",
          url: "https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg",
          isMain: true,
          order: 1
        }
      ]
    },
    {
      id: "2",
      title: "Living Exclusive Morumbi",
      description: "Apartamento com vista para o parque",
      type: "Apartamento",
      status: PropertyStatus.AVAILABLE,
      price: 1250000,
      area: 95,
      bedrooms: 2,
      bathrooms: 2,
      suites: 1,
      parkingSpaces: 1,
      address: "Rua Professor Alexandre Correia, 500",
      neighborhood: "Morumbi",
      city: "São Paulo",
      state: "SP",
      zipCode: "05657-230",
      constructionStage: "Na planta",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "1",
      isActive: true,
      isHighlighted: false,
      viewCount: 85,
      shareCount: 12,
      images: [
        {
          id: "2",
          propertyId: "2",
          url: "https://cdn.pixabay.com/photo/2016/11/21/15/09/apartments-1845884_1280.jpg",
          isMain: true,
          order: 1
        }
      ]
    },
    {
      id: "3",
      title: "Lavvi Moema",
      description: "Jardim privativo e área de lazer completa",
      type: "Apartamento",
      status: PropertyStatus.AVAILABLE,
      price: 2150000,
      area: 140,
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parkingSpaces: 2,
      address: "Alameda dos Anapurus, 1000",
      neighborhood: "Moema",
      city: "São Paulo",
      state: "SP",
      zipCode: "04087-001",
      constructionStage: "Pronto para morar",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "1",
      isActive: true,
      isHighlighted: false,
      viewCount: 65,
      shareCount: 8,
      images: [
        {
          id: "3",
          propertyId: "3",
          url: "https://cdn.pixabay.com/photo/2014/07/10/17/18/large-home-389271_1280.jpg",
          isMain: true,
          order: 1
        }
      ]
    },
    {
      id: "4",
      title: "Cyrela Bothanic Campo Belo",
      description: "Área verde e sustentabilidade",
      type: "Apartamento",
      status: PropertyStatus.AVAILABLE,
      price: 1650000,
      area: 110,
      bedrooms: 3,
      bathrooms: 2,
      suites: 1,
      parkingSpaces: 1,
      address: "Rua Gabriele D'Annunzio, 800",
      neighborhood: "Campo Belo",
      city: "São Paulo",
      state: "SP",
      zipCode: "04619-004",
      constructionStage: "Na planta",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "1",
      isActive: true,
      isHighlighted: false,
      viewCount: 42,
      shareCount: 5,
      images: [
        {
          id: "4",
          propertyId: "4",
          url: "https://cdn.pixabay.com/photo/2016/08/11/23/48/mountains-1587287_1280.jpg",
          isMain: true,
          order: 1
        }
      ]
    },
  ];
  
  const handleApplyFilters = (filters: any) => {
    console.log("Applied filters:", filters);
    // Here you would filter the properties based on the selected filters
  };
  
  const handleResetFilters = () => {
    console.log("Filters reset");
    // Here you would reset the filters and show all properties
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cyrela-gray-lightest">
      {/* Header */}
      <header className="bg-white border-b border-cyrela-gray-lighter sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <AppLogo />
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center text-cyrela-gray-dark"
              onClick={() => window.location.href = "/client/broker"}
            >
              <Phone size={16} className="mr-2 shrink-0" />
              <span className="hidden lg:inline">Falar com o corretor</span>
              <span className="lg:hidden">Corretor</span>
            </Button>
            
            <Button
              className="hidden md:flex items-center bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white"
              size="sm"
            >
              <Share size={16} className="mr-2 shrink-0" />
              <span className="hidden lg:inline">Compartilhar resultados</span>
              <span className="lg:hidden">Compartilhar</span>
            </Button>
            
            <Button
              className="md:hidden flex items-center bg-cyrela-blue hover:bg-cyrela-blue hover:opacity-90 text-white rounded-full p-2"
              size="icon"
            >
              <Share size={16} />
            </Button>
            
            <Button
              className="md:hidden flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full p-2"
              size="icon"
            >
              <MessageSquare size={16} />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Search bar */}
      <div className="bg-cyrela-blue text-white sticky top-[69px] z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto md:flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyrela-gray-dark" size={18} />
              <input
                type="text"
                placeholder="Buscar por localização, empreendimento ou características"
                className="w-full pl-10 pr-4 py-2 rounded-md border border-cyrela-gray-lighter focus:outline-none focus:ring-2 focus:ring-cyrela-blue focus:border-transparent text-black"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="outline"
                className="flex-1 md:flex-none bg-white text-cyrela-blue border-white hover:bg-cyrela-gray-lighter"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                {isMobileFilterOpen ? (
                  <>
                    <X size={16} className="mr-2 shrink-0" />
                    <span>Fechar filtros</span>
                  </>
                ) : (
                  <>
                    <Filter size={16} className="mr-2 shrink-0" />
                    <span>Filtros</span>
                  </>
                )}
              </Button>
              
              <Button className="flex-1 md:flex-none bg-white text-cyrela-blue border-white hover:bg-cyrela-gray-lighter">
                Ordenar
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar filters */}
          <div className={`
            ${isMobileFilterOpen ? 'fixed' : 'hidden'} 
            lg:block lg:relative top-[133px] lg:top-0 left-0 w-full h-[calc(100vh-133px)] lg:h-auto lg:w-auto
            z-50 bg-cyrela-gray-lightest lg:bg-transparent
            overflow-y-auto lg:overflow-visible p-4 lg:p-0
          `}>
            <div className="sticky top-4">
              <div className="flex justify-between items-center lg:hidden mb-4">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              <PropertyFilter 
                onApplyFilters={handleApplyFilters}
                onReset={handleResetFilters}
                className="max-h-[calc(100vh-180px)] lg:max-h-full overflow-auto"
              />
            </div>
          </div>
          
          {/* Property listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-semibold text-cyrela-gray-dark">
                {mockProperties.length} imóveis encontrados
              </h2>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 md:flex-none bg-white text-cyrela-gray-dark border-cyrela-gray-lighter hover:bg-cyrela-gray-lighter"
                >
                  Ordenar por relevância
                </Button>
                
                <Button 
                  className="flex-1 md:flex-none bg-cyrela-blue text-white hover:bg-cyrela-blue hover:opacity-90"
                >
                  Mapa
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProperties.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property}
                  showActions={true}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating button to contact broker on mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <Button
          className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white h-14 w-14 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </Button>
      </div>
      
      {/* Overlay for mobile filter */}
      {isMobileFilterOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyListingPage;
