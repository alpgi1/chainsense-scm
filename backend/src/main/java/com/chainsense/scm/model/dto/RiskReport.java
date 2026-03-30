package com.chainsense.scm.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public record RiskReport(
        String summary,

        @JsonProperty("overallRiskScore")
        int overallRiskScore,

        @JsonProperty("disruptionType")
        String disruptionType,

        @JsonProperty("estimatedDurationDays")
        int estimatedDurationDays,

        @JsonProperty("affectedProducts")
        List<AffectedProduct> affectedProducts,

        @JsonProperty("affectedRoutes")
        List<String> affectedRoutes
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AffectedProduct(
            @JsonProperty("productId") UUID productId,
            @JsonProperty("productName") String productName,
            @JsonProperty("sku") String sku,
            @JsonProperty("currentStock") int currentStock,
            @JsonProperty("dailyConsumption") int dailyConsumption,
            @JsonProperty("daysOfStockRemaining") double daysOfStockRemaining,
            @JsonProperty("productRiskScore") int productRiskScore,
            @JsonProperty("impactReason") String impactReason
    ) {}
}
