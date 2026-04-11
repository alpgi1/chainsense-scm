package com.chainsense.scm.model.dto;

import java.util.UUID;

public record ExecutionResult(
        UUID disruptionId,
        int actionsApproved,
        int inventoryUpdates
) {}
