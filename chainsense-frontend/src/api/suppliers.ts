import client from './client';
import type { Supplier } from '../types/inventory.types';

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await client.get<Supplier[]>('/suppliers');
    return data;
  },

  getById: async (id: string): Promise<Supplier> => {
    const { data } = await client.get<Supplier>(`/suppliers/${id}`);
    return data;
  },

  getAtRisk: async (): Promise<Supplier[]> => {
    const { data } = await client.get<Supplier[]>('/suppliers/at-risk');
    return data;
  },
};
