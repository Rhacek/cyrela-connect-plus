
import { Property } from "@/types";

export const cyrelaProperties: Property[] = [
  {
    id: "1",
    title: "Cyrela Iconyc Santos",
    developmentName: "Iconyc Santos",
    description: "Apartamento de luxo na Beira-Mar",
    type: "Apartamento",
    price: 1850000,
    promotionalPrice: 1750000,
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
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    id: "4",
    title: "Cyrela Bothanic Campo Belo",
    description: "Área verde e sustentabilidade",
    type: "Apartamento",
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
  {
    id: "5",
    title: "Cyrela Landscape Perdizes",
    description: "Vista panorâmica da cidade",
    type: "Apartamento",
    price: 1950000,
    area: 125,
    bedrooms: 3,
    bathrooms: 2,
    suites: 1,
    parkingSpaces: 2,
    address: "Rua Diana, 500",
    neighborhood: "Perdizes",
    city: "São Paulo",
    state: "SP",
    zipCode: "05019-000",
    constructionStage: "Em construção",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "1",
    isActive: true,
    isHighlighted: false,
    viewCount: 78,
    shareCount: 15,
    images: [
      {
        id: "5",
        propertyId: "5",
        url: "https://cdn.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg",
        isMain: true,
        order: 1
      }
    ]
  }
];
