package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.entity.SupplyRoute;
import com.chainsense.scm.repository.SupplyRouteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmbeddingIngestionService {

    private final VectorStore vectorStore;
    private final SupplyRouteRepository supplyRouteRepository;
    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ingestSupplyChainData() {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM supply_chain_embeddings", Integer.class);

        if (count != null && count > 0) {
            log.info("Supply chain embeddings already exist ({} documents) — skipping ingestion.", count);
            return;
        }

        log.info("Starting supply chain embedding ingestion...");
        List<SupplyRoute> routes = supplyRouteRepository.findAll();
        List<Document> documents = new ArrayList<>();

        for (SupplyRoute route : routes) {
            String content = buildDocumentText(route);
            Map<String, Object> metadata = Map.of(
                    "productId", route.getProduct().getId().toString(),
                    "supplierId", route.getSupplier().getId().toString(),
                    "category", route.getProduct().getCategory(),
                    "criticality", route.getProduct().getCriticality().name(),
                    "isPrimary", String.valueOf(route.getIsPrimary()),
                    "hubPorts", route.getHubPorts() != null
                            ? String.join(",", route.getHubPorts()) : ""
            );
            documents.add(new Document(content, metadata));
        }

        vectorStore.add(documents);
        log.info("Ingested {} supply chain documents into vector store.", documents.size());
    }

    private String buildDocumentText(SupplyRoute route) {
        String ports = (route.getHubPorts() == null || route.getHubPorts().isEmpty())
                ? "none (direct road)"
                : String.join(", ", route.getHubPorts());

        return """
                Product: %s (%s) | Criticality: %s | Category: %s
                Supplier: %s | Region: %s, %s | Reliability: %.2f | Lead Time: %d days
                Route: %s | Transit: %d days | Cost: €%.2f/unit | Primary: %s
                Hub Ports: %s
                """.formatted(
                route.getProduct().getName(),
                route.getProduct().getSku(),
                route.getProduct().getCriticality().name(),
                route.getProduct().getCategory(),
                route.getSupplier().getName(),
                route.getSupplier().getRegion().getName(),
                route.getSupplier().getRegion().getCountry(),
                route.getSupplier().getReliabilityScore(),
                route.getSupplier().getLeadTimeDays(),
                route.getTransitRoute(),
                route.getTransitDays(),
                route.getUnitCost(),
                Boolean.TRUE.equals(route.getIsPrimary()) ? "YES" : "NO",
                ports
        );
    }
}
