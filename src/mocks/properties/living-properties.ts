
import { Property } from "@/types";

export const livingProperties: Property[] = [
  {
    id: "2",
    title: "Living Exclusive Morumbi",
    developmentName: "Living Exclusive",
    description: "Apartamento com vista para o parque",
    type: "Apartamento",
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
    id: "6",
    title: "Living Urban Vila Madalena",
    description: "Próximo a bares e restaurantes",
    type: "Apartamento",
    price: 1100000,
    area: 85,
    bedrooms: 2,
    bathrooms: 1,
    suites: 1,
    parkingSpaces: 1,
    address: "Rua Girassol, 350",
    neighborhood: "Vila Madalena",
    city: "São Paulo",
    state: "SP",
    zipCode: "05433-000",
    constructionStage: "Pronto para morar",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "1",
    isActive: true,
    isHighlighted: false,
    viewCount: 102,
    shareCount: 22,
    images: [
      {
        id: "6",
        propertyId: "6",
        url: "https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg",
        isMain: true,
        order: 1
      }
    ]
  }
];
