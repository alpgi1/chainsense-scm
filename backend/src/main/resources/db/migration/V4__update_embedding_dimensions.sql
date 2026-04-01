-- gemini-embedding-001 produces 3072-dimensional vectors (not 768)
-- pgvector HNSW/IVFFlat indexes are limited to 2000 dimensions, so we drop the index.
-- Sequential scan is sufficient for the small dataset size used in this application.
DROP INDEX IF EXISTS supply_chain_embeddings_embedding_idx;

ALTER TABLE supply_chain_embeddings
    ALTER COLUMN embedding TYPE vector(3072);
