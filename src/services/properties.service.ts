
import { Property, PropertyImage } from '@/types';
import { queryService } from './properties/query.service';
import { mutationService } from './properties/mutation.service';
import { PropertyFilter } from './properties/types';

export const propertiesService = {
  // Query methods
  getAllActiveProperties: queryService.getAllActiveProperties,
  getBrokerProperties: queryService.getAllActiveProperties, // Default implementation using filters
  getById: queryService.getById,
  getProperty: queryService.getById,  // Alias for getById
  getAll: queryService.getAll,

  // Mutation methods
  update: mutationService.update,
  create: mutationService.create,
  delete: mutationService.delete,
  
  // Image related methods
  addImage: mutationService.addImage,
  deleteImage: mutationService.deleteImage
};
