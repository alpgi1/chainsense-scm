package com.chainsense.scm.model.dto;

import com.chainsense.scm.model.enums.RetrievalMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CompareRequest(
        @NotBlank(message = "Prompt A must not be blank")
        @Size(min = 10, max = 2000, message = "Prompt A must be between 10 and 2000 characters")
        String promptA,

        @NotBlank(message = "Prompt B must not be blank")
        @Size(min = 10, max = 2000, message = "Prompt B must be between 10 and 2000 characters")
        String promptB,

        RetrievalMode retrievalMode
) {
    public CompareRequest {
        if (retrievalMode == null) {
            retrievalMode = RetrievalMode.CONTEXT;
        }
    }
}
