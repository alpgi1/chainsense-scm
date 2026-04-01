package com.chainsense.scm.util;

import com.chainsense.scm.model.dto.ActionPlan;
import com.chainsense.scm.model.dto.RiskReport;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;

class JsonDeserializationTest {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Test
    void deserializeRiskReport_fromValidJson_succeeds() throws Exception {
        String json = """
                {
                  "summary": "Hamburg port strike impacts supply chain",
                  "overallRiskScore": 85,
                  "disruptionType": "LABOR_STRIKE",
                  "estimatedDurationDays": 7,
                  "affectedProducts": [{
                    "productId": "c1000000-0000-0000-0000-000000000001",
                    "productName": "Lithium Ion Cell 21700",
                    "sku": "LIC-21700-A",
                    "currentStock": 8500,
                    "dailyConsumption": 2000,
                    "daysOfStockRemaining": 4.25,
                    "productRiskScore": 100,
                    "impactReason": "Primary route uses Hamburg port"
                  }],
                  "affectedRoutes": ["Shanghai → Hamburg Port → Munich"]
                }
                """;

        RiskReport report = objectMapper.readValue(json, RiskReport.class);

        assertThat(report.overallRiskScore()).isEqualTo(85);
        assertThat(report.disruptionType()).isEqualTo("LABOR_STRIKE");
        assertThat(report.affectedProducts()).hasSize(1);
        assertThat(report.affectedProducts().get(0).productName()).isEqualTo("Lithium Ion Cell 21700");
    }

    @Test
    void deserializeActionPlan_withValidUUIDs_succeeds() throws Exception {
        String json = """
                {
                  "executiveSummary": "Switch suppliers to mitigate risk",
                  "actions": [{
                    "actionType": "SWITCH_SUPPLIER",
                    "affectedProductId": "c1000000-0000-0000-0000-000000000001",
                    "productName": "Lithium Ion Cell 21700",
                    "recommendedSupplierId": "b1000000-0000-0000-0000-000000000002",
                    "supplierName": "Busan Energy Corp.",
                    "rationale": "Best reliability score and transit time",
                    "currentUnitCost": 4.5,
                    "newUnitCost": 5.2,
                    "costDifferencePercent": 15.56,
                    "currentTransitDays": 18,
                    "newTransitDays": 14,
                    "priority": "URGENT"
                  }],
                  "costSummary": {
                    "totalAdditionalCostPerDay": 100.0,
                    "estimatedTotalImpact": 700.0,
                    "productsAtRisk": 5,
                    "productsWithAlternatives": 5
                  }
                }
                """;

        ActionPlan plan = objectMapper.readValue(json, ActionPlan.class);

        assertThat(plan.executiveSummary()).isEqualTo("Switch suppliers to mitigate risk");
        assertThat(plan.actions()).hasSize(1);
        assertThat(plan.actions().get(0).actionType()).isEqualTo("SWITCH_SUPPLIER");
        assertThat(plan.actions().get(0).recommendedSupplierId()).isEqualTo("b1000000-0000-0000-0000-000000000002");
    }

    @Test
    void deserializeActionPlan_withInvalidUUID_succeeds() {
        String json = """
                {
                  "executiveSummary": "Action plan",
                  "actions": [{
                    "actionType": "SWITCH_SUPPLIER",
                    "affectedProductId": "product-id-fake",
                    "productName": "Test Product",
                    "recommendedSupplierId": "supplier-id-frankfurt-chem",
                    "supplierName": "Some Supplier",
                    "rationale": "Best option",
                    "currentUnitCost": 10.0,
                    "newUnitCost": 11.0,
                    "costDifferencePercent": 10.0,
                    "currentTransitDays": 5,
                    "newTransitDays": 3,
                    "priority": "HIGH"
                  }],
                  "costSummary": {
                    "totalAdditionalCostPerDay": 0.0,
                    "estimatedTotalImpact": 0.0,
                    "productsAtRisk": 1,
                    "productsWithAlternatives": 1
                  }
                }
                """;

        assertThatNoException().isThrownBy(() -> {
            ActionPlan plan = objectMapper.readValue(json, ActionPlan.class);
            assertThat(plan.actions().get(0).recommendedSupplierId()).isEqualTo("supplier-id-frankfurt-chem");
        });
    }

    @Test
    void deserializeActionPlan_withNullRecommendedSupplierId_succeeds() throws Exception {
        String json = """
                {
                  "executiveSummary": "Hold strategy",
                  "actions": [{
                    "actionType": "HOLD",
                    "affectedProductId": "c1000000-0000-0000-0000-000000000005",
                    "productName": "Temperature Sensor Module",
                    "recommendedSupplierId": null,
                    "supplierName": null,
                    "rationale": "Stock sufficient to outlast disruption",
                    "currentUnitCost": 3.2,
                    "newUnitCost": 0.0,
                    "costDifferencePercent": 0.0,
                    "currentTransitDays": 11,
                    "newTransitDays": 0,
                    "priority": "LOW"
                  }],
                  "costSummary": {
                    "totalAdditionalCostPerDay": 0.0,
                    "estimatedTotalImpact": 0.0,
                    "productsAtRisk": 1,
                    "productsWithAlternatives": 0
                  }
                }
                """;

        ActionPlan plan = objectMapper.readValue(json, ActionPlan.class);

        assertThat(plan.actions().get(0).actionType()).isEqualTo("HOLD");
        assertThat(plan.actions().get(0).recommendedSupplierId()).isNull();
        assertThat(plan.actions().get(0).supplierName()).isNull();
    }
}
