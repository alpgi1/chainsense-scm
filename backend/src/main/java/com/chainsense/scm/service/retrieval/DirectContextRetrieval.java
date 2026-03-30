package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.service.SupplyChainQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class DirectContextRetrieval implements ContextRetrievalStrategy {

    private final SupplyChainQueryService queryService;

    @Override
    public String retrieveContext(String chaosPrompt) {
        log.debug("DirectContextRetrieval: building full supply chain context");
        return queryService.buildFullContext();
    }

    @Override
    public String retrieveAlternativeContext(List<UUID> affectedProductIds) {
        log.debug("DirectContextRetrieval: building alternative context for {} products", affectedProductIds.size());
        return queryService.buildAlternativeContext(affectedProductIds);
    }

    @Override
    public RetrievalMode getMode() {
        return RetrievalMode.CONTEXT;
    }
}
