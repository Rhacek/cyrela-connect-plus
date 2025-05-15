
import { Property } from "@/types";

export interface SharedLink {
  id: string;
  brokerId: string;
  propertyId: string;
  property?: Property;
  code: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  clicks: number;
  lastClickedAt?: string;
  isActive: boolean;
  notes?: string;
}

export interface ShareStats {
  totalShares: number;
  totalClicks: number;
  activeLinks: number;
  averageClicksPerShare: number;
  mostSharedProperty: {
    id: string;
    name: string;
    count: number;
  };
}
