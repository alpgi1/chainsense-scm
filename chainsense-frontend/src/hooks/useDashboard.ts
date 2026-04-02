import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard';
import type { DashboardStats, Product } from '../types/inventory.types';
import type { DisruptionResponse } from '../types/risk.types';
import type { BackendProductSummary, BackendRecentDisruption } from '../types/api.types';
import { MOCK_DASHBOARD_STATS, MOCK_PRODUCTS, MOCK_DISRUPTIONS } from '../data/mockData';

interface DashboardData {
  stats: DashboardStats;
  criticalProducts: Product[];
  recentDisruptions: DisruptionResponse[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function mapProductSummaryToProduct(p: BackendProductSummary): Product {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    criticality: p.criticality,
    quantityOnHand: p.quantityOnHand,
    reorderPoint: p.reorderPoint,
    maxCapacity: 10000,
    dailyConsumptionRate: p.dailyConsumptionRate,
    unitCost: 0,
    leadTimeDays: 0,
    supplierId: '',
    daysOfStockRemaining: Math.round(p.daysOfStock * 10) / 10,
  };
}

function mapRecentDisruption(d: BackendRecentDisruption): DisruptionResponse {
  return {
    id: d.id,
    chaosPrompt: d.chaosPrompt,
    overallRiskScore: d.overallRiskScore,
    status: d.status as DisruptionResponse['status'],
    retrievalMode: d.retrievalMode as DisruptionResponse['retrievalMode'],
    createdAt: d.createdAt,
    // Minimal placeholders — only needed for history list display
    riskReport: {
      summary: '',
      overallRiskScore: d.overallRiskScore,
      disruptionType: 'UNKNOWN',
      estimatedDurationDays: 0,
      affectedProducts: [],
      affectedRoutes: [],
    },
    actionPlan: {
      executiveSummary: '',
      actions: [],
      costSummary: {
        totalAdditionalCostPerDay: 0,
        estimatedTotalImpact: 0,
        productsAtRisk: 0,
        productsWithAlternatives: 0,
      },
    },
  };
}

export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats>(MOCK_DASHBOARD_STATS);
  const [criticalProducts, setCriticalProducts] = useState<Product[]>([]);
  const [recentDisruptions, setRecentDisruptions] = useState<DisruptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboard = await dashboardApi.get();

      // Map inventory stats to DashboardStats
      const mappedStats: DashboardStats = {
        totalProducts: dashboard.inventoryStats.totalProducts,
        criticalStockItems: dashboard.inventoryStats.criticalCount,
        activeDisruptions: dashboard.recentDisruptions.filter(
          (d) => d.status === 'PENDING' || d.status === 'PROPOSED'
        ).length,
        pendingActions: dashboard.recentDisruptions.filter((d) => d.status === 'PENDING').length,
        avgRiskScore:
          dashboard.recentDisruptions.length > 0
            ? Math.round(
                dashboard.recentDisruptions.reduce((sum, d) => sum + d.overallRiskScore, 0) /
                  dashboard.recentDisruptions.length
              )
            : 0,
        suppliersAtRisk: dashboard.suppliers.filter((s) => s.reliabilityScore < 0.7).length,
        totalInventoryValue: 0, // not provided by backend
        onTimeDeliveryRate: 87.4, // static for demo
      };

      setStats(mappedStats);
      setCriticalProducts(
        dashboard.products
          .filter((p) => p.belowReorder || p.criticality === 'CRITICAL')
          .map(mapProductSummaryToProduct)
      );
      setRecentDisruptions(dashboard.recentDisruptions.map(mapRecentDisruption));
    } catch {
      setError('Failed to load dashboard data');
      setStats(MOCK_DASHBOARD_STATS);
      setCriticalProducts(
        MOCK_PRODUCTS.filter((p) => p.criticality === 'CRITICAL' || (p.daysOfStockRemaining ?? 99) <= 10)
      );
      setRecentDisruptions(MOCK_DISRUPTIONS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { stats, criticalProducts, recentDisruptions, loading, error, refresh: fetchData };
}
