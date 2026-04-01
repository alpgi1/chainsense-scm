package com.chainsense.scm.service.retrieval;

import com.chainsense.scm.repository.SupplyRouteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmbeddingIngestionServiceTest {

    @Mock
    private VectorStore vectorStore;

    @Mock
    private SupplyRouteRepository supplyRouteRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    private EmbeddingIngestionService ingestionService;

    @BeforeEach
    void setUp() {
        ingestionService = new EmbeddingIngestionService(vectorStore, supplyRouteRepository, jdbcTemplate);
    }

    @Test
    void ingestSupplyChainData_whenEmbeddingsExist_skipsIngestion() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class))).thenReturn(46);

        ingestionService.ingestSupplyChainData();

        verify(vectorStore, never()).add(anyList());
        verify(supplyRouteRepository, never()).findAll();
    }

    @Test
    void ingestSupplyChainData_whenEmpty_ingestsDocuments() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class))).thenReturn(0);
        when(supplyRouteRepository.findAll()).thenReturn(List.of());

        ingestionService.ingestSupplyChainData();

        verify(vectorStore).add(anyList());
    }
}
