
import { Property } from "@/types";
import { mockProperties } from "./property-data";

export interface SharedLink {
  id: string;
  brokerId: string;
  propertyId: string;
  property?: Property;
  code: string;
  url: string;
  createdAt: Date;
  expiresAt?: Date;
  clicks: number;
  lastClickedAt?: Date;
  isActive: boolean;
  notes?: string;
}

// Generate a random code for shared links
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create mock data based on the properties
export const mockSharedLinks: SharedLink[] = mockProperties.map((property, index) => {
  const code = generateCode();
  return {
    id: `share-${index + 1}`,
    brokerId: "broker-1",
    propertyId: property.id,
    property: property,
    code: code,
    url: `https://living.com.br/s/${code}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    expiresAt: index % 3 === 0 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
    clicks: Math.floor(Math.random() * 100),
    lastClickedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000) : undefined,
    isActive: Math.random() > 0.2,
    notes: index % 2 === 0 ? `Compartilhado com cliente ${index + 1}` : undefined,
  };
});

// Aggregate mock stats
export const mockShareStats = {
  totalShares: mockSharedLinks.length,
  totalClicks: mockSharedLinks.reduce((sum, link) => sum + link.clicks, 0),
  activeLinks: mockSharedLinks.filter(link => link.isActive).length,
  averageClicksPerShare: Math.round(
    mockSharedLinks.reduce((sum, link) => sum + link.clicks, 0) / mockSharedLinks.length
  ),
  mostSharedProperty: mockProperties.reduce(
    (most, current) => {
      const shareCount = mockSharedLinks.filter(link => link.propertyId === current.id).length;
      return shareCount > most.count ? { id: current.id, name: current.title, count: shareCount } : most;
    },
    { id: "", name: "", count: 0 }
  ),
};
