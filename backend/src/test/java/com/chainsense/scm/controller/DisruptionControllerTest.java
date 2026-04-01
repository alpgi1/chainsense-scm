package com.chainsense.scm.controller;

import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.dto.*;
import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.model.enums.Status;
import com.chainsense.scm.repository.DisruptionLogRepository;
import com.chainsense.scm.service.agent.AgentOrchestrator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DisruptionControllerTest {

    @Mock
    private AgentOrchestrator orchestrator;

    @Mock
    private DisruptionLogRepository disruptionLogRepository;

    @InjectMocks
    private DisruptionController controller;

    private DisruptionResponse buildSampleResponse(UUID id) {
        RiskReport riskReport = new RiskReport("summary", 85, "LABOR_STRIKE", 7, List.of(), List.of());
        ActionPlan actionPlan = new ActionPlan("plan", List.of(),
                new ActionPlan.CostSummary(0, 0, 0, 0));
        return DisruptionResponse.builder()
                .id(id)
                .chaosPrompt("Hamburg port strike")
                .riskReport(riskReport)
                .actionPlan(actionPlan)
                .overallRiskScore(85)
                .retrievalMode(RetrievalMode.CONTEXT)
                .status(Status.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void analyze_delegatesToOrchestrator() {
        UUID id = UUID.randomUUID();
        DisruptionResponse expected = buildSampleResponse(id);
        when(orchestrator.processDisruption(any(), any())).thenReturn(expected);

        ChaosPromptRequest request = new ChaosPromptRequest("Hamburg port strike blocks all shipments", RetrievalMode.CONTEXT);
        var response = controller.analyze(request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData().overallRiskScore()).isEqualTo(85);
        verify(orchestrator).processDisruption("Hamburg port strike blocks all shipments", RetrievalMode.CONTEXT);
    }

    @Test
    void listAll_returnsPagedResults() {
        DisruptionLog log = DisruptionLog.builder()
                .chaosPrompt("test").riskAnalysis("{}").actionPlan("{}").overallRiskScore(50)
                .retrievalMode(RetrievalMode.CONTEXT).build();
        when(disruptionLogRepository.findAllByOrderByCreatedAtDesc(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(log)));

        var response = controller.listAll(0, 10);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData()).hasSize(1);
    }

    @Test
    void getById_whenExists_returnsResponse() {
        UUID id = UUID.randomUUID();
        DisruptionLog log = DisruptionLog.builder()
                .chaosPrompt("test").riskAnalysis("{}").actionPlan("{}").overallRiskScore(50)
                .retrievalMode(RetrievalMode.CONTEXT).build();
        when(disruptionLogRepository.findById(id)).thenReturn(Optional.of(log));

        var response = controller.getById(id);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
    }

    @Test
    void getById_whenNotFound_throwsResourceNotFoundException() {
        UUID id = UUID.randomUUID();
        when(disruptionLogRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> controller.getById(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void updateActionStatus_delegatesToOrchestrator() {
        UUID disruptionId = UUID.randomUUID();
        UUID actionId = UUID.randomUUID();
        doNothing().when(orchestrator).updateActionStatus(any(), any(), any());

        ActionStatusRequest request = new ActionStatusRequest(Status.APPROVED);
        var response = controller.updateActionStatus(disruptionId, actionId, request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        verify(orchestrator).updateActionStatus(disruptionId, actionId, Status.APPROVED);
    }

    @Test
    void compare_delegatesToOrchestrator() {
        UUID idA = UUID.randomUUID();
        UUID idB = UUID.randomUUID();
        when(orchestrator.processDisruption(eq("Hamburg port strike blocks all container shipments"), any()))
                .thenReturn(buildSampleResponse(idA));
        when(orchestrator.processDisruption(eq("Suez Canal blocked by grounded vessel for two weeks"), any()))
                .thenReturn(buildSampleResponse(idB));

        CompareRequest request = new CompareRequest(
                "Hamburg port strike blocks all container shipments",
                "Suez Canal blocked by grounded vessel for two weeks",
                RetrievalMode.CONTEXT
        );
        var response = controller.compare(request);

        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isTrue();
        assertThat(response.getBody().getData().scenarioA()).isNotNull();
        assertThat(response.getBody().getData().scenarioB()).isNotNull();
    }

    private static <T> T eq(T value) {
        return org.mockito.ArgumentMatchers.eq(value);
    }
}
