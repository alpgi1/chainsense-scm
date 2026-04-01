package com.chainsense.scm.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ActionPlan(
        @JsonProperty("executiveSummary")
        String executiveSummary,

        @JsonProperty("actions")
        List<ActionItem> actions,

        @JsonProperty("costSummary")
        CostSummary costSummary
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ActionItem(
            @JsonProperty("actionType") String actionType,
            @JsonProperty("affectedProductId") String affectedProductId,
            @JsonProperty("productName") String productName,
            @JsonProperty("recommendedSupplierId") String recommendedSupplierId,
            @JsonProperty("supplierName") String supplierName,
            @JsonProperty("rationale") String rationale,
            @JsonProperty("currentUnitCost") double currentUnitCost,
            @JsonProperty("newUnitCost") double newUnitCost,
            @JsonProperty("costDifferencePercent") double costDifferencePercent,
            @JsonProperty("currentTransitDays") int currentTransitDays,
            @JsonProperty("newTransitDays") int newTransitDays,
            @JsonProperty("priority") String priority
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record CostSummary(
            @JsonProperty("totalAdditionalCostPerDay") double totalAdditionalCostPerDay,
            @JsonProperty("estimatedTotalImpact") double estimatedTotalImpact,
            @JsonProperty("productsAtRisk") int productsAtRisk,
            @JsonProperty("productsWithAlternatives") int productsWithAlternatives
    ) {}
}
