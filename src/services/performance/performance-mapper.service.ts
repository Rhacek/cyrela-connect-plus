
import { Performance } from '@/types';

// Type mapper functions
export const mapFromDbModel = (dbModel: any): Performance => ({
  id: dbModel.id,
  brokerId: dbModel.broker_id,
  month: dbModel.month,
  year: dbModel.year,
  shares: dbModel.shares,
  leads: dbModel.leads,
  schedules: dbModel.schedules,
  visits: dbModel.visits,
  sales: dbModel.sales
});

export const mapToDbModel = (model: Partial<Performance>) => ({
  broker_id: model.brokerId,
  month: model.month,
  year: model.year,
  shares: model.shares,
  leads: model.leads,
  schedules: model.schedules,
  visits: model.visits,
  sales: model.sales
});
