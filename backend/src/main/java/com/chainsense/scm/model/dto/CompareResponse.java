package com.chainsense.scm.model.dto;

public record CompareResponse(
        DisruptionResponse scenarioA,
        DisruptionResponse scenarioB
) {}
