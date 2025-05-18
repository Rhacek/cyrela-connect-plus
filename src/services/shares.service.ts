
import { sharesQueryService } from './shares/shares-query.service';
import { sharesMutationService } from './shares/shares-mutation.service';

// Combining all services for backward compatibility
export const sharesService = {
  ...sharesQueryService,
  ...sharesMutationService
};
