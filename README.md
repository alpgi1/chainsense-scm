# ChainSense SCM

A multi-agent AI-powered supply chain risk management platform for EV battery manufacturing lines. Built with Spring Boot 4, Spring AI 2, and React 19.

## Overview

ChainSense SCM enables operations teams to simulate real-world supply chain disruptions and receive AI-generated risk assessments and action plans in seconds.

**Core Flow:**
1. User enters a "Chaos Prompt" (e.g. *"Hamburg port strike affecting all inbound shipments"*)
2. **Agent 1 — Risk Analyst** queries the supply chain database, identifies affected products and routes, calculates risk scores
3. **Agent 2 — Strategist** receives the risk report and produces a prioritized action plan with alternative suppliers
4. All decisions are persisted to an audit log; users can approve or reject individual actions

**Hybrid Retrieval Architecture:**
- **Standard Mode (default):** Full supply chain context is serialized and injected into the LLM prompt — deterministic and fast, ideal for demos
- **Enterprise RAG Mode:** Chaos prompt is embedded and matched against pgvector semantic search — demonstrates enterprise-scale data handling

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21 + Spring Boot 4.0.5 |
| AI Framework | Spring AI 2.0.0-M4 |
| LLM | Google Gemini 2.0 Flash (via Vertex AI) |
| Database | PostgreSQL 17 + pgvector |
| Migrations | Flyway 11 |
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| Deployment | Supabase (DB) + Render (API + Frontend) |

---

## Domain

Simulates the supply chain of a Munich-based EV battery manufacturer:

- **15 regions** across Asia, Europe, Americas, and Middle East
- **30 suppliers** spanning battery cells, BMS electronics, wiring, cooling, structural parts, and more
- **20 products** covering the full EV battery pack bill of materials
- **46 supply routes** with real hub ports (Hamburg, Rotterdam, Suez Canal, etc.)
- Inventory levels intentionally varied — some products are below reorder point to create realistic demo tension

---

## Getting Started

### Prerequisites

- Java 21+
- Docker + Docker Compose
- Maven (or use the included `./mvnw` wrapper)

### 1. Start the database

```bash
cd backend
docker compose up -d
```

This starts:
- PostgreSQL 17 with pgvector on `localhost:5433`
- pgAdmin on `http://localhost:5051` (credentials: `admin@chainsense.dev` / `admin`)

### 2. Run database migrations

Flyway runs automatically on application startup and applies:
- `V1` — base tables (regions, suppliers, products, inventory, supply routes, disruption log, decision actions)
- `V2` — pgvector extension + embeddings table
- `V3` — seed data (15 regions, 30 suppliers, 20 products, 46 routes)

### 3. Configure environment variables

```bash
export GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
export GOOGLE_CLOUD_LOCATION=us-central1   # optional, defaults to us-central1
```

### 4. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

API available at `http://localhost:8080`

---

## API Reference

### Disruption Analysis

```http
POST /api/v1/disruptions/analyze
Content-Type: application/json

{
  "prompt": "Hamburg port strike affecting all inbound shipments for the next 3 weeks",
  "retrievalMode": "CONTEXT"
}
```

`retrievalMode`: `CONTEXT` (default, standard mode) or `RAG` (enterprise vector search)

### Other Endpoints

```
GET    /api/v1/disruptions              # List all disruptions (paginated)
GET    /api/v1/disruptions/{id}         # Get disruption detail
PATCH  /api/v1/disruptions/{id}/actions/{actionId}  # Approve or reject an action

GET    /api/v1/dashboard                # Aggregated risk overview
GET    /api/v1/products                 # Product catalog
GET    /api/v1/suppliers                # Supplier list
GET    /api/v1/inventory                # Current stock levels
PATCH  /api/v1/inventory/{id}           # Update inventory

GET    /api/v1/health
```

---

## Project Structure

```
chainsense-scm/
├── backend/
│   ├── src/main/java/com/chainsense/scm/
│   │   ├── ChainSenseApplication.java
│   │   ├── config/            # CORS, AI clients, vector store
│   │   ├── controller/        # REST endpoints
│   │   ├── service/
│   │   │   ├── agent/         # RiskAnalystAgent, StrategistAgent, AgentOrchestrator
│   │   │   └── retrieval/     # Strategy pattern: DirectContextRetrieval, RagContextRetrieval
│   │   ├── model/
│   │   │   ├── entity/        # JPA entities
│   │   │   ├── enums/         # Criticality, ActionType, Priority, Status, RetrievalMode
│   │   │   └── dto/           # Request/response objects
│   │   ├── repository/        # Spring Data JPA repositories
│   │   └── exception/         # Global exception handling
│   └── src/main/resources/
│       └── db/migration/      # Flyway SQL migrations
└── frontend/                  # React 19 + TypeScript (Phase 3)
```

---

## Frontend Demo Gate

The frontend uses a simple `sessionStorage`-based access gate.
Access code: **`TUM2026`**

---

## Deployment

### Supabase (Database)

1. Create a Supabase project
2. Enable the `pgvector` extension in the SQL editor: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Set the `DATABASE_URL` environment variable on Render

### Render (API)

Set the following environment variables:
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `GOOGLE_CLOUD_PROJECT_ID`
- `GOOGLE_CLOUD_LOCATION`

---

## Why This Is Not "Just Calling an LLM"

- The LLM queries **your database** via structured context — not general world knowledge
- Two agents form a **typed pipeline**: Agent 1 outputs a `RiskReport` object that Agent 2 consumes
- Output is **structured actions** (not prose), persisted to PostgreSQL with a full audit trail
- Agent 2 only receives data for products affected by the disruption — no unnecessary context bloat
- Retrieval mode is logged per-disruption so you can compare standard vs. RAG outputs
