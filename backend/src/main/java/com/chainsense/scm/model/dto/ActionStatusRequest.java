package com.chainsense.scm.model.dto;

import com.chainsense.scm.model.enums.Status;
import jakarta.validation.constraints.NotNull;

public record ActionStatusRequest(
        @NotNull(message = "Status must not be null")
        Status status
) {}
