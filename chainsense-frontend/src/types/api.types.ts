export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Backend DashboardResponse shape
export interface BackendDashboardResponse {
  inventoryStats: {
    totalProducts: number;
    belowReorderCount: number;
    criticalCount: number;
    averageDaysOfStock: number;
  };
  products: BackendProductSummary[];
  suppliers: BackendSupplierSummary[];
  alerts: BackendAlertItem[];
  recentDisruptions: BackendRecentDisruption[];
}

export interface BackendProductSummary {
  id: string;
  name: string;
  sku: string;
  category: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  quantityOnHand: number;
  dailyConsumptionRate: number;
  reorderPoint: number;
  daysOfStock: number;
  belowReorder: boolean;
}

export interface BackendSupplierSummary {
  id: string;
  name: string;
  country: string;
  reliabilityScore: number; // 0.0 - 1.0 from backend
  leadTimeDays: number;
  isActive: boolean;
  latitude?: number;
  longitude?: number;
}

export interface BackendAlertItem {
  productId: string;
  productName: string;
  criticality: string;
  quantityOnHand: number;
  reorderPoint: number;
  daysOfStock: number;
  alertLevel: string;
}

export interface BackendRecentDisruption {
  id: string;
  chaosPrompt: string;
  overallRiskScore: number;
  status: string;
  retrievalMode: string;
  createdAt: string;
}

// Backend Inventory entity shape
export interface BackendInventory {
  id: string;
  product: {
    id: string;
    name: string;
    sku: string;
    category: string;
    criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    unitPrice: number;
  };
  quantityOnHand: number;
  dailyConsumptionRate: number;
  reorderPoint: number;
  maxCapacity: number;
  warehouseLocation: string;
  lastUpdated: string;
}

// Backend Supplier entity shape
export interface BackendSupplier {
  id: string;
  name: string;
  region?: {
    id: string;
    name: string;
    country: string;
  };
  reliabilityScore: number; // 0.0 - 1.0
  leadTimeDays: number;
  contactEmail?: string;
  isActive: boolean;
  createdAt: string;
}
