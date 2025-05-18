
import { Property, PropertyImage } from '@/types';

// Type mapper functions
export const mapImageFromDb = (dbModel: any): PropertyImage => ({
  id: dbModel.id,
  propertyId: dbModel.property_id,
  url: dbModel.url,
  description: dbModel.description,
  isMain: dbModel.is_main,
  order: dbModel.order
});

export const mapPropertyFromDb = (dbModel: any, images: PropertyImage[] = []): Property => ({
  id: dbModel.id,
  title: dbModel.title,
  developmentName: dbModel.development_name,
  description: dbModel.description,
  type: dbModel.type,
  price: dbModel.price,
  promotionalPrice: dbModel.promotional_price,
  area: dbModel.area,
  bedrooms: dbModel.bedrooms,
  bathrooms: dbModel.bathrooms,
  suites: dbModel.suites,
  parkingSpaces: dbModel.parking_spaces,
  address: dbModel.address,
  neighborhood: dbModel.neighborhood,
  city: dbModel.city,
  state: dbModel.state,
  zipCode: dbModel.zip_code,
  latitude: dbModel.latitude,
  longitude: dbModel.longitude,
  constructionStage: dbModel.construction_stage,
  youtubeUrl: dbModel.youtube_url,
  commission: dbModel.commission,
  brokerNotes: dbModel.broker_notes,
  createdAt: new Date(dbModel.created_at),
  updatedAt: new Date(dbModel.updated_at),
  createdById: dbModel.created_by_id,
  isActive: dbModel.is_active,
  isHighlighted: dbModel.is_highlighted,
  viewCount: dbModel.view_count,
  shareCount: dbModel.share_count,
  images: images
});
