package com.chainsense.scm.service.agent;

import com.chainsense.scm.exception.AiProcessingException;
import com.chainsense.scm.model.dto.ActionPlan;
import com.chainsense.scm.model.dto.DisruptionResponse;
import com.chainsense.scm.model.dto.RiskReport;
import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.repository.DisruptionLogRepository;
import com.chainsense.scm.service.retrieval.ContextRetrievalStrategy;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AgentOrchestrator {

    private final Map<RetrievalMode, ContextRetrievalStrategy> strategies;
    private final RiskAnalystAgent riskAnalyst;
    private final StrategistAgent strategist;
    private final DisruptionLogRepository disruptionLogRepository;
    private final ObjectMapper objectMapper;

    public AgentOrchestrator(
            List<ContextRetrievalStrategy> strategyList,
            RiskAnalystAgent riskAnalyst,
            StrategistAgent strategist,
            DisruptionLogRepository disruptionLogRepository,
            ObjectMapper objectMapper) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(ContextRetrievalStrategy::getMode, s -> s));
        this.riskAnalyst = riskAnalyst;
        this.strategist = strategist;
        this.disruptionLogRepository = disruptionLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public DisruptionResponse processDisruption(String chaosPrompt, RetrievalMode mode) {
        ContextRetrievalStrategy strategy = strategies.get(mode);
        if (strategy == null) {
            log.warn("No strategy found for mode {}, falling back to CONTEXT", mode);
            strategy = strategies.get(RetrievalMode.CONTEXT);
        }

        log.info("Processing disruption | mode={} | prompt=\"{}\"", mode, chaosPrompt);

        // Step 1: Retrieve full supply chain context
        String context = strategy.retrieveContext(chaosPrompt);
        log.debug("Context retrieved: {} chars", context.length());

        // Step 2: Agent 1 — Risk Analysis
        RiskReport riskReport = riskAnalyst.analyze(chaosPrompt, context);
        log.info("RiskReport generated | overallRiskScore={} | affectedProducts={}",
                riskReport.overallRiskScore(), riskReport.affectedProducts().size());

        // Step 3: Retrieve filtered alternative supplier context
        List<UUID> affectedProductIds = riskReport.affectedProducts().stream()
                .map(RiskReport.AffectedProduct::productId)
                .collect(Collectors.toList());

        String altContext = strategy.retrieveAlternativeContext(affectedProductIds);
        log.debug("Alternative context retrieved: {} chars", altContext.length());

        // Step 4: Agent 2 — Strategy
        ActionPlan actionPlan = strategist.strategize(riskReport, altContext);
        log.info("ActionPlan generated | actions={}", actionPlan.actions().size());

        // Step 5: Persist to database
        DisruptionLog saved = persist(chaosPrompt, riskReport, actionPlan, mode);

        return DisruptionResponse.from(saved, riskReport, actionPlan);
    }

    private DisruptionLog persist(String chaosPrompt, RiskReport riskReport, ActionPlan actionPlan, RetrievalMode mode) {
        try {
            String riskJson = objectMapper.writeValueAsString(riskReport);
            String planJson = objectMapper.writeValueAsString(actionPlan);

            DisruptionLog log = DisruptionLog.builder()
                    .chaosPrompt(chaosPrompt)
                    .riskAnalysis(riskJson)
                    .actionPlan(planJson)
                    .overallRiskScore(riskReport.overallRiskScore())
                    .retrievalMode(mode)
                    .build();

            return disruptionLogRepository.save(log);
        } catch (Exception e) {
            throw new AiProcessingException("Failed to persist disruption log", e);
        }
    }
}
