-- Enable pgvector extension for RAG mode
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- SUPPLY_CHAIN_EMBEDDINGS: Vector store for RAG mode
-- ============================================================
CREATE TABLE supply_chain_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    embedding vector(768),
    created_at TIMESTAMP DEFAULT NOW()
);

-- HNSW index for fast approximate nearest neighbor search
CREATE INDEX ON supply_chain_embeddings
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 200);
