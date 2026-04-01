package com.chainsense.scm.service.agent;

import com.chainsense.scm.exception.AiProcessingException;
import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.dto.ActionPlan;
import com.chainsense.scm.model.dto.DisruptionResponse;
import com.chainsense.scm.model.dto.RiskReport;
import com.chainsense.scm.model.entity.DecisionAction;
import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.ActionType;
import com.chainsense.scm.model.enums.Priority;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.model.enums.Status;
import com.chainsense.scm.repository.DecisionActionRepository;
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
    private final DecisionActionRepository decisionActionRepository;
    private final ObjectMapper objectMapper;

    public AgentOrchestrator(
            List<ContextRetrievalStrategy> strategyList,
            RiskAnalystAgent riskAnalyst,
            StrategistAgent strategist,
            DisruptionLogRepository disruptionLogRepository,
            DecisionActionRepository decisionActionRepository,
            ObjectMapper objectMapper) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(ContextRetrievalStrategy::getMode, s -> s));
        this.riskAnalyst = riskAnalyst;
        this.strategist = strategist;
        this.disruptionLogRepository = disruptionLogRepository;
        this.decisionActionRepository = decisionActionRepository;
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

        String context = strategy.retrieveContext(chaosPrompt);
        log.debug("Context retrieved: {} chars", context.length());

        RiskReport riskReport = riskAnalyst.analyze(chaosPrompt, context);
        log.info("RiskReport generated | overallRiskScore={} | affectedProducts={}",
                riskReport.overallRiskScore(), riskReport.affectedProducts().size());

        List<UUID> affectedProductIds = riskReport.affectedProducts().stream()
                .map(RiskReport.AffectedProduct::productId)
                .collect(Collectors.toList());

        String altContext = strategy.retrieveAlternativeContext(affectedProductIds);
        log.debug("Alternative context retrieved: {} chars", altContext.length());

        ActionPlan actionPlan = strategist.strategize(riskReport, altContext);
        log.info("ActionPlan generated | actions={}", actionPlan.actions().size());

        DisruptionLog saved = persist(chaosPrompt, riskReport, actionPlan, mode);

        return DisruptionResponse.from(saved, riskReport, actionPlan);
    }

    @Transactional
    public void updateActionStatus(UUID disruptionId, UUID actionId, Status newStatus) {
        DisruptionLog disruption = disruptionLogRepository.findById(disruptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found: " + disruptionId));
        DecisionAction action = decisionActionRepository.findById(actionId)
                .orElseThrow(() -> new ResourceNotFoundException("Action not found: " + actionId));
        if (!action.getDisruption().getId().equals(disruption.getId())) {
            throw new ResourceNotFoundException("Action does not belong to this disruption");
        }
        action.setStatus(newStatus);
        decisionActionRepository.save(action);
        log.info("Action {} status updated to {} for disruption {}", actionId, newStatus, disruptionId);
    }

    private DisruptionLog persist(String chaosPrompt, RiskReport riskReport, ActionPlan actionPlan, RetrievalMode mode) {
        try {
            String riskJson = objectMapper.writeValueAsString(riskReport);
            String planJson = objectMapper.writeValueAsString(actionPlan);

            DisruptionLog saved = disruptionLogRepository.save(DisruptionLog.builder()
                    .chaosPrompt(chaosPrompt)
                    .riskAnalysis(riskJson)
                    .actionPlan(planJson)
                    .overallRiskScore(riskReport.overallRiskScore())
                    .retrievalMode(mode)
                    .build());

            if (actionPlan.actions() != null) {
                for (ActionPlan.ActionItem item : actionPlan.actions()) {
                    ActionType actionType = ActionType.HOLD;
                    try { actionType = ActionType.valueOf(item.actionType()); } catch (Exception ignored) {}

                    Priority priority = Priority.MEDIUM;
                    try { priority = Priority.valueOf(item.priority()); } catch (Exception ignored) {}

                    String description = (item.rationale() != null && !item.rationale().isBlank())
                            ? item.rationale()
                            : item.productName() + " - " + item.actionType();

                    decisionActionRepository.save(DecisionAction.builder()
                            .disruption(saved)
                            .actionType(actionType)
                            .description(description)
                            .priority(priority)
                            .status(Status.PROPOSED)
                            .build());
                }
            }

            return saved;
        } catch (AiProcessingException e) {
            throw e;
        } catch (Exception e) {
            throw new AiProcessingException("Failed to persist disruption log", e);
        }
    }
}
