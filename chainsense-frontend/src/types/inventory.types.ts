export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  quantityOnHand: number;
  reorderPoint: number;
  maxCapacity: number;
  dailyConsumptionRate: number;
  unitCost: number;
  leadTimeDays: number;
  supplierId: string;
  supplierName?: string;
  daysOfStockRemaining?: number;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  city: string;
  reliabilityScore: number;
  leadTimeDays: number;
  tier: number;
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  contactEmail?: string;
  annualContractValue?: number;
  activeContracts?: number;
}

export interface DashboardStats {
  totalProducts: number;
  criticalStockItems: number;
  activeDisruptions: number;
  pendingActions: number;
  avgRiskScore: number;
  suppliersAtRisk: number;
  totalInventoryValue: number;
  onTimeDeliveryRate: number;
}
