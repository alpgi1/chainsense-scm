import client from './client';
import type { BackendInventory } from '../types/api.types';
import type { Product } from '../types/inventory.types';

function mapInventoryToProduct(inv: BackendInventory): Product {
  const daysOfStock =
    inv.dailyConsumptionRate > 0
      ? inv.quantityOnHand / inv.dailyConsumptionRate
      : 999;
  return {
    id: inv.product.id,
    name: inv.product.name,
    sku: inv.product.sku,
    category: inv.product.category,
    criticality: inv.product.criticality,
    quantityOnHand: inv.quantityOnHand,
    reorderPoint: inv.reorderPoint,
    maxCapacity: inv.maxCapacity,
    dailyConsumptionRate: inv.dailyConsumptionRate,
    unitCost: inv.product.unitPrice ?? 0,
    leadTimeDays: 0, // not in inventory entity
    supplierId: '',  // not in inventory entity
    daysOfStockRemaining: Math.round(daysOfStock * 10) / 10,
  };
}

export const inventoryApi = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await client.get<BackendInventory[]>('/inventory');
    const list = Array.isArray(data) ? data : [];
    return list.map(mapInventoryToProduct);
  },

  getAlerts: async (): Promise<Product[]> => {
    const { data } = await client.get<BackendInventory[]>('/inventory/alerts');
    const list = Array.isArray(data) ? data : [];
    return list.map(mapInventoryToProduct);
  },

  // Kept for compatibility — uses alerts endpoint
  getCritical: async (): Promise<Product[]> => {
    return inventoryApi.getAlerts();
  },
};
