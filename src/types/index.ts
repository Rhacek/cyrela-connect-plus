
// Define main types for the application

export enum UserRole {
  ADMIN = "ADMIN",
  BROKER = "BROKER",
  CLIENT = "CLIENT"
}

export enum PlanType {
  FREE = "FREE",
  PRO = "PRO"
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  INTERESTED = "INTERESTED",
  SCHEDULED = "SCHEDULED",
  VISITED = "VISITED",
  CONVERTED = "CONVERTED",
  LOST = "LOST"
}

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD"
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  plan: PlanType;
  profileImage?: string;
  createdAt: Date;
  lastLoginAt?: Date;
  
  // Broker specific fields
  brokerCode?: string;
  brokerage?: string;
  
  // Client specific fields
  budget?: number;
  desiredLocation?: string;
  preferredBedrooms?: number;
  preferredBathrooms?: number;
}

export interface Property {
  id: string;
  title: string;
  developmentName?: string; // Added development name field
  description: string;
  type: string;
  status: PropertyStatus;
  price: number;
  promotionalPrice?: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  suites: number;
  parkingSpaces: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  floorPlan?: string;
  constructionYear?: number;
  constructionStage?: string;
  amenities?: any;
  youtubeUrl?: string;
  
  // Broker fields
  commission?: number;
  brokerNotes?: string;
  launchDate?: Date;
  deliveryDate?: Date;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  isActive: boolean;
  isHighlighted: boolean;
  viewCount: number;
  shareCount: number;
  
  // Related data
  images: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  description?: string;
  isMain: boolean;
  order: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  notes?: string;
  source: string;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
  assignedToId?: string;
  propertyId?: string;
  
  // Qualifying questions
  budget?: number;
  desiredLocation?: string;
  preferredBedrooms?: number;
  preferredBathrooms?: number;
  targetMoveDate?: Date;
}

export interface Target {
  id: string;
  brokerId: string;
  month: number;
  year: number;
  shareTarget: number; // 2600/month
  leadTarget: number; // 104/month
  scheduleTarget: number; // 8/month
  visitTarget: number; // 4/month
  saleTarget: number; // 1/month
}

export interface Performance {
  id: string;
  brokerId: string;
  month: number;
  year: number;
  shares: number;
  leads: number;
  schedules: number;
  visits: number;
  sales: number;
}
