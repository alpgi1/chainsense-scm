package com.chainsense.scm.service.agent;

import com.chainsense.scm.exception.AiProcessingException;
import com.chainsense.scm.model.dto.ActionPlan;
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
public class StrategistAgent {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;
    private final int maxRetries;

    public StrategistAgent(
            @Qualifier("strategistClient") ChatClient chatClient,
            ObjectMapper objectMapper,
            @Value("${chainsense.ai.max-retries:2}") int maxRetries) {
        this.chatClient = chatClient;
        this.objectMapper = objectMapper;
        this.maxRetries = maxRetries;
    }

    public ActionPlan strategize(RiskReport riskReport, String alternativeContext) {
        String riskReportJson;
        try {
            riskReportJson = objectMapper.writeValueAsString(riskReport);
        } catch (Exception e) {
            throw new AiProcessingException("Failed to serialize RiskReport for Strategist", e);
        }

        String userMessage = """
                RISK REPORT FROM ANALYST AGENT:
                %s

                ALTERNATIVE SUPPLIER DATA (filtered to affected products only):
                %s
                """.formatted(riskReportJson, alternativeContext);

        Exception lastException = null;

        for (int attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                log.info("StrategistAgent attempt {}/{}", attempt + 1, maxRetries + 1);

                String raw = chatClient.prompt()
                        .user(userMessage)
                        .call()
                        .content();

                String cleaned = JsonCleaner.clean(raw);
                log.debug("StrategistAgent raw response cleaned: {} chars", cleaned.length());

                return objectMapper.readValue(cleaned, ActionPlan.class);

            } catch (Exception e) {
                lastException = e;
                log.warn("StrategistAgent attempt {} failed: {}", attempt + 1, e.getMessage());
            }
        }

        throw new AiProcessingException("StrategistAgent failed after " + (maxRetries + 1) + " attempts", lastException);
    }
}
