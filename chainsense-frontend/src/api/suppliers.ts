import client from './client';
import type { BackendSupplier } from '../types/api.types';
import type { Supplier } from '../types/inventory.types';

function mapBackendSupplier(s: BackendSupplier): Supplier {
  // Backend reliabilityScore is 0.0-1.0; frontend expects 0-100
  const reliabilityScore = s.reliabilityScore <= 1
    ? Math.round(s.reliabilityScore * 100)
    : s.reliabilityScore;

  const riskLevel: Supplier['riskLevel'] =
    reliabilityScore >= 90 ? 'LOW' :
    reliabilityScore >= 75 ? 'MEDIUM' :
    reliabilityScore >= 60 ? 'HIGH' : 'CRITICAL';

  return {
    id: s.id,
    name: s.name,
    country: s.region?.country ?? 'Unknown',
    city: s.region?.name ?? '',
    reliabilityScore,
    leadTimeDays: s.leadTimeDays ?? 0,
    tier: 1, // not in backend entity
    category: 'General',
    riskLevel,
    contactEmail: s.contactEmail,
  };
}

export const suppliersApi = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await client.get<BackendSupplier[]>('/suppliers');
    const list = Array.isArray(data) ? data : [];
    return list.map(mapBackendSupplier);
  },

  getActive: async (): Promise<Supplier[]> => {
    const { data } = await client.get<BackendSupplier[]>('/suppliers/active');
    const list = Array.isArray(data) ? data : [];
    return list.map(mapBackendSupplier);
  },
};
