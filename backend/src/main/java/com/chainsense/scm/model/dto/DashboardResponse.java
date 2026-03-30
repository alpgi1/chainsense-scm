package com.chainsense.scm.model.dto;

import java.util.List;

public record DashboardResponse(
        InventoryStats inventoryStats,
        List<ProductSummary> products,
        List<SupplierSummary> suppliers,
        List<AlertItem> alerts,
        List<RecentDisruption> recentDisruptions
) {

    public record InventoryStats(
            int totalProducts,
            int belowReorderCount,
            int criticalCount,
            double averageDaysOfStock
    ) {}

    public record ProductSummary(
            String id,
            String name,
            String sku,
            String category,
            String criticality,
            int quantityOnHand,
            int dailyConsumptionRate,
            int reorderPoint,
            double daysOfStock,
            boolean belowReorder
    ) {}

    public record SupplierSummary(
            String id,
            String name,
            String country,
            double reliabilityScore,
            int leadTimeDays,
            boolean isActive,
            double latitude,
            double longitude
    ) {}

    public record AlertItem(
            String productId,
            String productName,
            String criticality,
            int quantityOnHand,
            int reorderPoint,
            double daysOfStock,
            String alertLevel
    ) {}

    public record RecentDisruption(
            String id,
            String chaosPrompt,
            int overallRiskScore,
            String status,
            String retrievalMode,
            String createdAt
    ) {}
}
