package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.service.SupplyChainQueryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DirectContextRetrievalTest {

    @Mock
    private SupplyChainQueryService queryService;

    private DirectContextRetrieval retrieval;

    @BeforeEach
    void setUp() {
        retrieval = new DirectContextRetrieval(queryService);
    }

    @Test
    void retrieveContext_delegatesToQueryService() {
        when(queryService.buildFullContext()).thenReturn("full context data");

        String result = retrieval.retrieveContext("Hamburg port strike");

        assertThat(result).isEqualTo("full context data");
        verify(queryService).buildFullContext();
    }

    @Test
    void retrieveAlternativeContext_delegatesToQueryService() {
        List<UUID> ids = List.of(UUID.randomUUID(), UUID.randomUUID());
        when(queryService.buildAlternativeContext(ids)).thenReturn("alternative context");

        String result = retrieval.retrieveAlternativeContext(ids);

        assertThat(result).isEqualTo("alternative context");
        verify(queryService).buildAlternativeContext(ids);
    }

    @Test
    void getMode_returnsContext() {
        assertThat(retrieval.getMode()).isEqualTo(RetrievalMode.CONTEXT);
    }
}
