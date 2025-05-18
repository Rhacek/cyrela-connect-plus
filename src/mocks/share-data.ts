
import { Property } from "@/types";
import { mockProperties } from "./property-data";
import { SharedLink } from "@/types/share";

// Generate a random code for shared links
const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create mock data based on the properties
export const mockSharedLinks: SharedLink[] = mockProperties.map((property, index) => {
  const code = generateCode();
  const now = new Date();
  return {
    id: `share-${index + 1}`,
    brokerId: "broker-1",
    propertyId: property.id,
    property: property,
    code: code,
    url: `https://living.com.br/s/${code}`,
    // Convert Date objects to ISO strings to match our type definition
    createdAt: new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: index % 3 === 0 
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() 
      : undefined,
    clicks: Math.floor(Math.random() * 100),
    lastClickedAt: Math.random() > 0.3 
      ? new Date(now.getTime() - Math.floor(Math.random() * 5) * 24 * 60 * 60 * 1000).toISOString() 
      : undefined,
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
