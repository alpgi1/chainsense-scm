package com.chainsense.scm.model.dto;

import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public record DisruptionResponse(
        UUID id,
        String chaosPrompt,
        RiskReport riskReport,
        ActionPlan actionPlan,
        int overallRiskScore,
        RetrievalMode retrievalMode,
        Status status,
        LocalDateTime createdAt
) {
    private static final ObjectMapper MAPPER = new ObjectMapper()
            .findAndRegisterModules();

    public static DisruptionResponse from(DisruptionLog log, RiskReport riskReport, ActionPlan actionPlan) {
        return DisruptionResponse.builder()
                .id(log.getId())
                .chaosPrompt(log.getChaosPrompt())
                .riskReport(riskReport)
                .actionPlan(actionPlan)
                .overallRiskScore(log.getOverallRiskScore() != null ? log.getOverallRiskScore() : 0)
                .retrievalMode(log.getRetrievalMode())
                .status(log.getStatus())
                .createdAt(log.getCreatedAt())
                .build();
    }

    public static DisruptionResponse from(DisruptionLog log) {
        RiskReport riskReport = null;
        ActionPlan actionPlan = null;
        try {
            if (log.getRiskAnalysis() != null) {
                riskReport = MAPPER.readValue(log.getRiskAnalysis(), RiskReport.class);
            }
            if (log.getActionPlan() != null) {
                actionPlan = MAPPER.readValue(log.getActionPlan(), ActionPlan.class);
            }
        } catch (Exception e) {
            // Return null fields if JSON is malformed — caller handles gracefully
        }
        return from(log, riskReport, actionPlan);
    }
}
