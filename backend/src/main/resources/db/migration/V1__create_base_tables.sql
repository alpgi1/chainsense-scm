-- ============================================================
-- REGIONS: Geographic zones for supplier/route mapping
-- ============================================================
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    risk_modifier DECIMAL(3, 2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SUPPLIERS: Companies that provide parts
-- ============================================================
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    region_id UUID NOT NULL REFERENCES regions(id),
    reliability_score DECIMAL(3, 2) DEFAULT 0.85,
    lead_time_days INT NOT NULL,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS: Items in the EV battery production line
-- ============================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    criticality VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INVENTORY: Current stock levels
-- ============================================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_on_hand INT NOT NULL DEFAULT 0,
    daily_consumption_rate INT NOT NULL DEFAULT 0,
    reorder_point INT NOT NULL DEFAULT 0,
    max_capacity INT NOT NULL DEFAULT 10000,
    warehouse_location VARCHAR(100) DEFAULT 'Munich HQ',
    last_updated TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- SUPPLY_ROUTES: Which supplier provides which product via which route
-- ============================================================
CREATE TABLE supply_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    product_id UUID NOT NULL REFERENCES products(id),
    unit_cost DECIMAL(10, 2) NOT NULL,
    transit_route VARCHAR(500),
    transit_days INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    hub_ports TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DISRUPTION_LOG: Every chaos prompt and its analysis (audit trail)
-- ============================================================
CREATE TABLE disruption_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chaos_prompt TEXT NOT NULL,
    risk_analysis JSONB NOT NULL,
    action_plan JSONB,
    overall_risk_score INT,
    retrieval_mode VARCHAR(20) DEFAULT 'CONTEXT',
    status VARCHAR(20) DEFAULT 'PENDING',
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- DECISION_ACTIONS: Individual actions within an action plan
-- ============================================================
CREATE TABLE decision_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disruption_id UUID NOT NULL REFERENCES disruption_log(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    affected_product_id UUID REFERENCES products(id),
    recommended_supplier_id UUID REFERENCES suppliers(id),
    cost_impact DECIMAL(10, 2),
    time_impact_days INT,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'PROPOSED',
    created_at TIMESTAMP DEFAULT NOW()
);
