package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.enums.RetrievalMode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RagContextRetrieval implements ContextRetrievalStrategy {

    private final VectorStore vectorStore;

    @Override
    public String retrieveContext(String chaosPrompt) {
        log.debug("RagContextRetrieval: semantic search for prompt '{}'", chaosPrompt);

        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(chaosPrompt)
                        .topK(15)
                        .similarityThreshold(0.4)
                        .build()
        );

        log.info("RAG retrieved {} documents for context", results.size());
        return results.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));
    }

    @Override
    public String retrieveAlternativeContext(List<UUID> affectedProductIds) {
        if (affectedProductIds.isEmpty()) return "";

        log.debug("RagContextRetrieval: retrieving alternative context for {} products", affectedProductIds.size());

        // Build a filter expression to match any of the affected product IDs
        String filterExpr = "productId in ['"
                + affectedProductIds.stream()
                        .map(UUID::toString)
                        .collect(Collectors.joining("','"))
                + "']";

        List<Document> results = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query("alternative supplier route")
                        .topK(affectedProductIds.size() * 3)
                        .similarityThresholdAll()
                        .filterExpression(filterExpr)
                        .build()
        );

        log.info("RAG retrieved {} alternative documents for {} products",
                results.size(), affectedProductIds.size());
        return results.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n"));
    }

    @Override
    public RetrievalMode getMode() {
        return RetrievalMode.RAG;
    }
}
