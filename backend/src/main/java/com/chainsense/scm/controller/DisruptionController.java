package com.chainsense.scm.controller;

import com.chainsense.scm.exception.AiProcessingException;
import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.dto.*;
import com.chainsense.scm.model.entity.DisruptionLog;
import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.repository.DisruptionLogRepository;
import com.chainsense.scm.service.agent.AgentOrchestrator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequestMapping("/api/v1/disruptions")
@RequiredArgsConstructor
public class DisruptionController {

    private final AgentOrchestrator orchestrator;
    private final DisruptionLogRepository disruptionLogRepository;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<DisruptionResponse>> analyze(
            @Valid @RequestBody ChaosPromptRequest request) {
        log.info("POST /api/v1/disruptions/analyze | mode={}", request.retrievalMode());
        DisruptionResponse response = orchestrator.processDisruption(request.prompt(), request.retrievalMode());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/compare")
    public ResponseEntity<ApiResponse<CompareResponse>> compare(
            @Valid @RequestBody CompareRequest request) {
        log.info("POST /api/v1/disruptions/compare | mode={}", request.retrievalMode());
        RetrievalMode mode = request.retrievalMode() != null ? request.retrievalMode() : RetrievalMode.CONTEXT;

        CompletableFuture<DisruptionResponse> futureA = CompletableFuture.supplyAsync(
                () -> orchestrator.processDisruption(request.promptA(), mode)
        );
        CompletableFuture<DisruptionResponse> futureB = CompletableFuture.supplyAsync(
                () -> orchestrator.processDisruption(request.promptB(), mode)
        );

        try {
            CompareResponse result = new CompareResponse(futureA.get(), futureB.get());
            return ResponseEntity.ok(ApiResponse.ok(result));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AiProcessingException("Comparison interrupted", e);
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof AiProcessingException ape) throw ape;
            if (cause instanceof RuntimeException re) throw re;
            throw new AiProcessingException("Comparison failed", e);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DisruptionResponse>>> listAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<DisruptionLog> logs = disruptionLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        List<DisruptionResponse> responses = logs.stream()
                .map(DisruptionResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DisruptionResponse>> getById(@PathVariable UUID id) {
        DisruptionLog disruptionLog = disruptionLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(DisruptionResponse.from(disruptionLog)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DisruptionResponse>> updateDisruptionStatus(
            @PathVariable UUID id,
            @Valid @RequestBody ActionStatusRequest request) {
        log.info("PATCH /api/v1/disruptions/{}/status | status={}", id, request.status());
        DisruptionLog disruption = disruptionLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found: " + id));
        disruption.setStatus(request.status());
        disruptionLogRepository.save(disruption);
        return ResponseEntity.ok(ApiResponse.ok(DisruptionResponse.from(disruption)));
    }

    @PatchMapping("/{id}/actions/{actionId}")
    public ResponseEntity<ApiResponse<Void>> updateActionStatus(
            @PathVariable UUID id,
            @PathVariable UUID actionId,
            @Valid @RequestBody ActionStatusRequest request) {
        log.info("PATCH /api/v1/disruptions/{}/actions/{} | status={}", id, actionId, request.status());
        orchestrator.updateActionStatus(id, actionId, request.status());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
