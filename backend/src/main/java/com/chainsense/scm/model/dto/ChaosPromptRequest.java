package com.chainsense.scm.model.dto;

import com.chainsense.scm.model.enums.RetrievalMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChaosPromptRequest(
        @NotBlank(message = "Prompt must not be blank")
        @Size(min = 10, max = 2000, message = "Prompt must be between 10 and 2000 characters")
        String prompt,

        RetrievalMode retrievalMode
) {
    public ChaosPromptRequest {
        if (retrievalMode == null) {
            retrievalMode = RetrievalMode.CONTEXT;
        }
    }
}
