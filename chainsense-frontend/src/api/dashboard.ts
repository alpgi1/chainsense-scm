import client from './client';
import type { BackendDashboardResponse } from '../types/api.types';

export const dashboardApi = {
  get: async (): Promise<BackendDashboardResponse> => {
    const { data } = await client.get<BackendDashboardResponse>('/dashboard');
    return data;
  },
};
