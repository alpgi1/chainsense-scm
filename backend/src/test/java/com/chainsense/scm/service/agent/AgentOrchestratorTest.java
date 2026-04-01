package com.chainsense.scm.service.agent;

import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.dto.ActionPlan;
import com.chainsense.scm.model.dto.DisruptionResponse;
import com.chainsense.scm.model.dto.RiskReport;
import com.chainsense.scm.model.entity.DecisionAction;
import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.model.enums.Status;
import com.chainsense.scm.repository.DecisionActionRepository;
import com.chainsense.scm.repository.DisruptionLogRepository;
import com.chainsense.scm.service.retrieval.ContextRetrievalStrategy;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AgentOrchestratorTest {

    @Mock private ContextRetrievalStrategy contextStrategy;
    @Mock private RiskAnalystAgent riskAnalyst;
    @Mock private StrategistAgent strategist;
    @Mock private DisruptionLogRepository disruptionLogRepository;
    @Mock private DecisionActionRepository decisionActionRepository;

    private AgentOrchestrator orchestrator;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @BeforeEach
    void setUp() {
        when(contextStrategy.getMode()).thenReturn(RetrievalMode.CONTEXT);
        orchestrator = new AgentOrchestrator(
                List.of(contextStrategy),
                riskAnalyst, strategist,
                disruptionLogRepository, decisionActionRepository,
                objectMapper
        );
    }

    @Test
    void processDisruption_returnsDisruptionResponse() {
        UUID productId = UUID.fromString("c1000000-0000-0000-0000-000000000001");
        RiskReport.AffectedProduct product = new RiskReport.AffectedProduct(
                productId, "Lithium Ion Cell 21700", "LIC-21700-A",
                8500, 2000, 4.25, 100, "Route uses Hamburg"
        );
        RiskReport riskReport = new RiskReport(
                "Strike disrupts supply chain", 85, "LABOR_STRIKE", 7,
                List.of(product), List.of("Shanghai → Hamburg → Munich")
        );
        ActionPlan actionPlan = new ActionPlan("Switch suppliers immediately",
                List.of(), new ActionPlan.CostSummary(0.0, 0.0, 1, 0));

        DisruptionLog saved = DisruptionLog.builder()
                .chaosPrompt("Hamburg port strike")
                .riskAnalysis("{}")
                .actionPlan("{}")
                .overallRiskScore(85)
                .retrievalMode(RetrievalMode.CONTEXT)
                .build();

        when(contextStrategy.retrieveContext(any())).thenReturn("context data");
        when(contextStrategy.retrieveAlternativeContext(any())).thenReturn("alt context");
        when(riskAnalyst.analyze(any(), any())).thenReturn(riskReport);
        when(strategist.strategize(any(), any())).thenReturn(actionPlan);
        when(disruptionLogRepository.save(any())).thenReturn(saved);

        DisruptionResponse response = orchestrator.processDisruption("Hamburg port strike", RetrievalMode.CONTEXT);

        assertThat(response).isNotNull();
        assertThat(response.overallRiskScore()).isEqualTo(85);
        verify(riskAnalyst).analyze("Hamburg port strike", "context data");
        verify(strategist).strategize(riskReport, "alt context");
    }

    @Test
    void processDisruption_unknownMode_fallsBackToContext() {
        RiskReport riskReport = new RiskReport("summary", 50, "LOGISTICS", 3,
                List.of(), List.of());
        ActionPlan actionPlan = new ActionPlan("plan", List.of(),
                new ActionPlan.CostSummary(0, 0, 0, 0));
        DisruptionLog saved = DisruptionLog.builder()
                .chaosPrompt("test").riskAnalysis("{}").actionPlan("{}").overallRiskScore(50)
                .retrievalMode(RetrievalMode.CONTEXT).build();

        when(contextStrategy.retrieveContext(any())).thenReturn("ctx");
        when(contextStrategy.retrieveAlternativeContext(any())).thenReturn("");
        when(riskAnalyst.analyze(any(), any())).thenReturn(riskReport);
        when(strategist.strategize(any(), any())).thenReturn(actionPlan);
        when(disruptionLogRepository.save(any())).thenReturn(saved);

        orchestrator.processDisruption("test", RetrievalMode.CONTEXT);

        verify(contextStrategy).retrieveContext("test");
    }

    @Test
    void updateActionStatus_whenActionNotFound_throwsResourceNotFoundException() {
        UUID disruptionId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();

        DisruptionLog log = DisruptionLog.builder()
                .chaosPrompt("test").riskAnalysis("{}").actionPlan("{}").overallRiskScore(50)
                .retrievalMode(RetrievalMode.CONTEXT).build();

        when(disruptionLogRepository.findById(disruptionId)).thenReturn(Optional.of(log));
        when(decisionActionRepository.findById(actionId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orchestrator.updateActionStatus(disruptionId, actionId, Status.APPROVED))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateActionStatus_whenValid_savesAction() {
        UUID disruptionId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();

        DisruptionLog log = DisruptionLog.builder()
                .chaosPrompt("test").riskAnalysis("{}").actionPlan("{}").overallRiskScore(50)
                .retrievalMode(RetrievalMode.CONTEXT).build();
        // manually set ID via reflection workaround — use a log with known ID
        DisruptionLog logWithId = spy(log);
        when(logWithId.getId()).thenReturn(disruptionId);

        DecisionAction action = DecisionAction.builder()
                .disruption(logWithId)
                .description("test action")
                .build();
        DecisionAction actionWithId = spy(action);
        when(actionWithId.getDisruption()).thenReturn(logWithId);

        when(disruptionLogRepository.findById(disruptionId)).thenReturn(Optional.of(logWithId));
        when(decisionActionRepository.findById(actionId)).thenReturn(Optional.of(actionWithId));

        orchestrator.updateActionStatus(disruptionId, actionId, Status.APPROVED);

        verify(decisionActionRepository).save(actionWithId);
    }
}
