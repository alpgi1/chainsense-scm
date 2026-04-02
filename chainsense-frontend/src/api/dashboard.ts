import client from './client';
import type { DashboardStats } from '../types/inventory.types';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await client.get<DashboardStats>('/dashboard/stats');
    return data;
  },
};
