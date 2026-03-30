package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.enums.RetrievalMode;

import java.util.List;
import java.util.UUID;

public interface ContextRetrievalStrategy {

    /**
     * Retrieves full supply chain context relevant to the given chaos prompt.
     * Agents receive this as plain text — they do not know which mode produced it.
     */
    String retrieveContext(String chaosPrompt);

    /**
     * Retrieves alternative supplier context filtered to the given affected product IDs.
     * Used by Agent 2 (Strategist) to find replacement options.
     */
    String retrieveAlternativeContext(List<UUID> affectedProductIds);

    RetrievalMode getMode();
}
