export interface RiskReport {
  summary: string;
  overallRiskScore: number;
  disruptionType: string;
  estimatedDurationDays: number;
  affectedProducts: AffectedProduct[];
  affectedRoutes: string[];
}

export interface AffectedProduct {
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  dailyConsumption: number;
  daysOfStockRemaining: number;
  productRiskScore: number;
  impactReason: string;
}

export interface ActionPlan {
  executiveSummary: string;
  actions: ActionItem[];
  costSummary: CostSummary;
}

export interface ActionItem {
  actionType: 'SWITCH_SUPPLIER' | 'REROUTE' | 'INCREASE_STOCK' | 'HOLD';
  affectedProductId: string;
  productName: string;
  recommendedSupplierId: string | null;
  supplierName: string | null;
  rationale: string;
  currentUnitCost: number;
  newUnitCost: number;
  costDifferencePercent: number;
  currentTransitDays: number;
  newTransitDays: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'PROPOSED' | 'APPROVED' | 'REJECTED';
  id?: string;
}

export interface CostSummary {
  totalAdditionalCostPerDay: number;
  estimatedTotalImpact: number;
  productsAtRisk: number;
  productsWithAlternatives: number;
}

export interface DisruptionResponse {
  id: string;
  chaosPrompt: string;
  riskReport: RiskReport;
  actionPlan: ActionPlan;
  overallRiskScore: number;
  retrievalMode: 'CONTEXT' | 'RAG';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
  createdAt: string;
}

export interface CompareResponse {
  scenarioA: DisruptionResponse;
  scenarioB: DisruptionResponse;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ActionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESOLVED';
export type RetrievalMode = 'CONTEXT' | 'RAG';

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return 'var(--risk-low)';
    case 'MEDIUM': return 'var(--risk-medium)';
    case 'HIGH': return 'var(--risk-high)';
    case 'CRITICAL': return 'var(--risk-critical)';
  }
}
