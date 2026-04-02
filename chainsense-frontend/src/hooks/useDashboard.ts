import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboard';
import { inventoryApi } from '../api/inventory';
import { disruptionsApi } from '../api/disruptions';
import type { DashboardStats, Product } from '../types/inventory.types';
import type { DisruptionResponse } from '../types/risk.types';
import { MOCK_DASHBOARD_STATS, MOCK_PRODUCTS, MOCK_DISRUPTIONS } from '../data/mockData';

interface DashboardData {
  stats: DashboardStats;
  criticalProducts: Product[];
  recentDisruptions: DisruptionResponse[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
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
      const [statsData, productsData, disruptionsData] = await Promise.allSettled([
        dashboardApi.getStats(),
        inventoryApi.getCritical(),
        disruptionsApi.getAll(),
      ]);

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      } else {
        setStats(MOCK_DASHBOARD_STATS);
      }

      if (productsData.status === 'fulfilled') {
        setCriticalProducts(productsData.value);
      } else {
        setCriticalProducts(
          MOCK_PRODUCTS.filter((p) => p.criticality === 'CRITICAL' || p.daysOfStockRemaining! <= 10)
        );
      }

      if (disruptionsData.status === 'fulfilled') {
        setRecentDisruptions(disruptionsData.value.slice(0, 5));
      } else {
        setRecentDisruptions(MOCK_DISRUPTIONS);
      }
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
