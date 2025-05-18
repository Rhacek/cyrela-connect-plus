
import { ShareDbModel, SharedLink } from './shares-types';

/**
 * Maps database model to frontend model
 */
export const mapFromDbModel = (dbModel: ShareDbModel): SharedLink => ({
  id: dbModel.id,
  brokerId: dbModel.broker_id,
  propertyId: dbModel.property_id,
  code: dbModel.code,
  url: dbModel.url,
  createdAt: dbModel.created_at,
  expiresAt: dbModel.expires_at,
  clicks: dbModel.clicks,
  lastClickedAt: dbModel.last_clicked_at,
  isActive: dbModel.is_active,
  notes: dbModel.notes,
  property: dbModel.properties ? mapPropertyFromDb(dbModel.properties) : undefined,
});

/**
 * Maps frontend model to database model
 */
export const mapToDbModel = (model: Partial<SharedLink>) => ({
  broker_id: model.brokerId,
  property_id: model.propertyId,
  code: model.code,
  url: model.url,
  created_at: model.createdAt,
  expires_at: model.expiresAt,
  clicks: model.clicks,
  last_clicked_at: model.lastClickedAt,
  is_active: model.isActive,
  notes: model.notes,
});

/**
 * Maps property data from database format
 */
const mapPropertyFromDb = (propertyData: any) => {
  if (!propertyData) return undefined;
  
  return {
    id: propertyData.id || propertyData.property_id,
    title: propertyData.title || "Imóvel sem título",
    developmentName: propertyData.development_name || "",
    images: propertyData.images || [],
    // Add missing required Property fields with default values
    description: "",
    type: "",
    price: 0,
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    suites: 0,
    parkingSpaces: 0,
    address: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdById: "",
    isActive: true,
    isHighlighted: false,
    viewCount: 0,
    shareCount: 0
  };
};
