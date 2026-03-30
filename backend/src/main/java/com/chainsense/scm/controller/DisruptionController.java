package com.chainsense.scm.controller;

import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.dto.ApiResponse;
import com.chainsense.scm.model.dto.ChaosPromptRequest;
import com.chainsense.scm.model.dto.DisruptionResponse;
import com.chainsense.scm.model.entity.DisruptionLog;
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
        DisruptionLog log = disruptionLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disruption not found: " + id));
        return ResponseEntity.ok(ApiResponse.ok(DisruptionResponse.from(log)));
    }
}
