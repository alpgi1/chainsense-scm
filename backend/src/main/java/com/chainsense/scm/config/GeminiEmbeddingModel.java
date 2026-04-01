package com.chainsense.scm.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Custom EmbeddingModel that calls Gemini's native batchEmbedContents API directly.
 * Bypasses Spring AI's OpenAI-compatible client path confusion for embeddings.
 * Model: text-embedding-004 | Dimensions: 768
 */
@Slf4j
@Primary
@Component
public class GeminiEmbeddingModel implements EmbeddingModel {

    private static final String BATCH_EMBED_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents";
    private static final String MODEL_ID = "models/gemini-embedding-001";
    private static final int DIMENSIONS = 3072;

    private final RestClient restClient;
    private final String apiKey;

    public GeminiEmbeddingModel(@Value("${GEMINI_API_KEY}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.create();
    }

    @Override
    public EmbeddingResponse call(EmbeddingRequest request) {
        List<String> texts = request.getInstructions();
        if (texts.isEmpty()) {
            return new EmbeddingResponse(List.of());
        }

        List<Map<String, Object>> requests = texts.stream()
                .map(text -> Map.<String, Object>of(
                        "model", MODEL_ID,
                        "content", Map.of("parts", List.of(Map.of("text", text)))
                ))
                .toList();

        log.debug("GeminiEmbeddingModel: embedding {} texts", texts.size());

        @SuppressWarnings("unchecked")
        Map<String, Object> responseBody = restClient.post()
                .uri(BATCH_EMBED_URL + "?key=" + apiKey)
                .header("Content-Type", "application/json")
                .body(Map.of("requests", requests))
                .retrieve()
                .body(Map.class);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> embeddings =
                (List<Map<String, Object>>) responseBody.get("embeddings");

        List<Embedding> results = new ArrayList<>();
        for (int i = 0; i < embeddings.size(); i++) {
            @SuppressWarnings("unchecked")
            List<Number> values = (List<Number>) embeddings.get(i).get("values");
            float[] floats = new float[values.size()];
            for (int j = 0; j < values.size(); j++) {
                floats[j] = values.get(j).floatValue();
            }
            results.add(new Embedding(floats, i));
        }

        return new EmbeddingResponse(results);
    }

    @Override
    public float[] embed(Document document) {
        return embed(document.getText());
    }

    @Override
    public int dimensions() {
        return DIMENSIONS;
    }
}
