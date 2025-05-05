
import { Property, PropertyStatus } from "@/types";

export const mockProperties: Property[] = [
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
