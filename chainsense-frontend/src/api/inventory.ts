import client from './client';
import type { Product } from '../types/inventory.types';

export const inventoryApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await client.get<Product[]>('/products');
    return data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await client.get<Product>(`/products/${id}`);
    return data;
  },

  getCritical: async (): Promise<Product[]> => {
    const { data } = await client.get<Product[]>('/products/critical');
    return data;
  },
};
