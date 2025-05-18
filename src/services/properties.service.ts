
import { Property, PropertyImage } from '@/types';
import { queryService } from './properties/query.service';
import { mutationService } from './properties/mutation.service';
import { PropertyFilter } from './properties/types';

export const propertiesService = {
  // Query methods
  getAllActiveProperties: queryService.getAllActiveProperties,
  
  // Add these methods when they are implemented in queryService
  // getBrokerProperties: queryService.getBrokerProperties,
  // getById: queryService.getById,
  // getProperty: queryService.getById,
  // getAll: queryService.getAll,

  // Mutation methods (assuming these exist in mutationService)
  update: mutationService.update,
  create: mutationService.create,
  delete: mutationService.delete,
  
  // Image related methods
  addImage: mutationService.addImage,
  deleteImage: mutationService.deleteImage
};
