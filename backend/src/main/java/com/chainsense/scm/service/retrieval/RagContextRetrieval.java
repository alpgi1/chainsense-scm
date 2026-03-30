package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.enums.RetrievalMode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * RAG mode retrieval — uses pgvector semantic search.
 * Activated when the user toggles "Enterprise RAG Mode" in the frontend.
 * Requires Spring AI VectorStore bean (configured in Phase 3 when AI keys are present).
 */
@Slf4j
@Service
public class RagContextRetrieval implements ContextRetrievalStrategy {

    @Override
    public String retrieveContext(String chaosPrompt) {
        // Phase 3: inject VectorStore and perform similarity search
        // SearchRequest request = SearchRequest.builder()
        //     .query(chaosPrompt).topK(15).similarityThreshold(0.5).build();
        // return vectorStore.similaritySearch(request).stream()
        //     .map(Document::getText).collect(Collectors.joining("\n"));
        log.warn("RAG mode is not yet configured — falling back to empty context");
        return "";
    }

    @Override
    public String retrieveAlternativeContext(List<UUID> affectedProductIds) {
        log.warn("RAG alternative context is not yet configured");
        return "";
    }

    @Override
    public RetrievalMode getMode() {
        return RetrievalMode.RAG;
    }
}
