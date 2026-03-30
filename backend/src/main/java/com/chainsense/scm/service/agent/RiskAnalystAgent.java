package com.chainsense.scm.service.agent;

import com.chainsense.scm.exception.AiProcessingException;
import com.chainsense.scm.model.dto.RiskReport;
import com.chainsense.scm.util.JsonCleaner;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RiskAnalystAgent {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final int maxRetries;

    public RiskAnalystAgent(
            @Qualifier("riskAnalystClient") ChatClient chatClient,
            ObjectMapper objectMapper,
            @Value("${chainsense.ai.max-retries:2}") int maxRetries) {
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
        this.maxRetries = maxRetries;
    }

    public RiskReport analyze(String chaosPrompt, String context) {
        String userMessage = """
                DISRUPTION EVENT: %s

                SUPPLY CHAIN DATA:
                %s
                """.formatted(chaosPrompt, context);

        Exception lastException = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                log.info("RiskAnalystAgent attempt {}/{}", attempt + 1, maxRetries + 1);

                String raw = chatClient.prompt()
                        .user(userMessage)
                        .call()
                        .content();

                String cleaned = JsonCleaner.clean(raw);
                log.debug("RiskAnalystAgent raw response cleaned: {} chars", cleaned.length());

                return objectMapper.readValue(cleaned, RiskReport.class);

            } catch (Exception e) {
                lastException = e;
                log.warn("RiskAnalystAgent attempt {} failed: {}", attempt + 1, e.getMessage());
            }
        }

        throw new AiProcessingException("RiskAnalystAgent failed after " + (maxRetries + 1) + " attempts", lastException);
    }
}
