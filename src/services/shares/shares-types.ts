
import { Property } from '@/types';

// Core interfaces
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
  } | null;
}

export interface CreateShareParams {
  brokerId: string;
  propertyId: string;
  notes?: string;
}

// Database model types
export interface ShareDbModel {
  id: string;
  broker_id: string;
  property_id: string;
  code: string;
  url: string;
  created_at: string;
  expires_at?: string;
  clicks: number;
  last_clicked_at?: string;
  is_active: boolean;
  notes?: string;
  properties?: any;
}
