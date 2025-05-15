
import { Property } from "@/types";

export const otherProperties: Property[] = [
  {
    id: "3",
    title: "Lavvi Moema",
    description: "Jardim privativo e área de lazer completa",
    type: "Apartamento",
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
  }
];
