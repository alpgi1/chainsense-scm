-- ============================================================
-- REGIONS (15 — covers major global supply chain hubs)
-- ============================================================
INSERT INTO regions (id, name, country, latitude, longitude, risk_modifier) VALUES
('a1000000-0000-0000-0000-000000000001', 'Shanghai, China', 'China', 31.2304, 121.4737, 1.20),
('a1000000-0000-0000-0000-000000000002', 'Taipei, Taiwan', 'Taiwan', 25.0330, 121.5654, 1.40),
('a1000000-0000-0000-0000-000000000003', 'Busan, South Korea', 'South Korea', 35.1796, 129.0756, 0.90),
('a1000000-0000-0000-0000-000000000004', 'Osaka, Japan', 'Japan', 34.6937, 135.5023, 0.85),
('a1000000-0000-0000-0000-000000000005', 'Shenzhen, China', 'China', 22.5431, 114.0579, 1.25),
('a1000000-0000-0000-0000-000000000006', 'Ho Chi Minh City, Vietnam', 'Vietnam', 10.8231, 106.6297, 1.10),
('a1000000-0000-0000-0000-000000000007', 'Hamburg, Germany', 'Germany', 53.5511, 9.9937, 0.70),
('a1000000-0000-0000-0000-000000000008', 'Rotterdam, Netherlands', 'Netherlands', 51.9244, 4.4777, 0.70),
('a1000000-0000-0000-0000-000000000009', 'Wroclaw, Poland', 'Poland', 51.1079, 17.0385, 0.80),
('a1000000-0000-0000-0000-000000000010', 'Gothenburg, Sweden', 'Sweden', 57.7089, 11.9746, 0.65),
('a1000000-0000-0000-0000-000000000011', 'Milan, Italy', 'Italy', 45.4642, 9.1900, 0.85),
('a1000000-0000-0000-0000-000000000012', 'Detroit, USA', 'USA', 42.3314, -83.0458, 0.75),
('a1000000-0000-0000-0000-000000000013', 'Monterrey, Mexico', 'Mexico', 25.6866, -100.3161, 0.95),
('a1000000-0000-0000-0000-000000000014', 'Jeddah, Saudi Arabia', 'Saudi Arabia', 21.4858, 39.1925, 1.10),
('a1000000-0000-0000-0000-000000000015', 'Port Said, Egypt', 'Egypt', 31.2653, 32.3019, 1.30);

-- ============================================================
-- SUPPLIERS (30)
-- ============================================================
INSERT INTO suppliers (id, name, region_id, reliability_score, lead_time_days, contact_email) VALUES
('b1000000-0000-0000-0000-000000000001', 'Shanghai LiPower Co.', 'a1000000-0000-0000-0000-000000000001', 0.92, 18, 'sales@lipower.cn'),
('b1000000-0000-0000-0000-000000000002', 'Busan Energy Corp.', 'a1000000-0000-0000-0000-000000000003', 0.88, 14, 'export@busanenergy.kr'),
('b1000000-0000-0000-0000-000000000003', 'Osaka CellTech Ltd.', 'a1000000-0000-0000-0000-000000000004', 0.90, 16, 'b2b@osakacell.jp'),
('b1000000-0000-0000-0000-000000000004', 'Shenzhen BattCo Ltd.', 'a1000000-0000-0000-0000-000000000005', 0.86, 20, 'info@battco.cn'),
('b1000000-0000-0000-0000-000000000005', 'Taiwan SemiChip Inc.', 'a1000000-0000-0000-0000-000000000002', 0.95, 12, 'orders@semichip.tw'),
('b1000000-0000-0000-0000-000000000006', 'Korea MicroElec Co.', 'a1000000-0000-0000-0000-000000000003', 0.87, 10, 'sales@koreamicro.kr'),
('b1000000-0000-0000-0000-000000000007', 'Shenzhen ChipWorks', 'a1000000-0000-0000-0000-000000000005', 0.82, 15, 'export@chipworks.cn'),
('b1000000-0000-0000-0000-000000000008', 'Wroclaw AutoWire Sp.', 'a1000000-0000-0000-0000-000000000009', 0.93, 3, 'info@autowire.pl'),
('b1000000-0000-0000-0000-000000000009', 'Detroit CableCo LLC', 'a1000000-0000-0000-0000-000000000012', 0.80, 21, 'supply@detroitcable.us'),
('b1000000-0000-0000-0000-000000000010', 'Vietnam WireTech JSC', 'a1000000-0000-0000-0000-000000000006', 0.84, 22, 'sales@wiretech.vn'),
('b1000000-0000-0000-0000-000000000011', 'Hamburg ThermalTech GmbH', 'a1000000-0000-0000-0000-000000000007', 0.91, 2, 'vertrieb@thermaltech.de'),
('b1000000-0000-0000-0000-000000000012', 'Rotterdam CoolSys B.V.', 'a1000000-0000-0000-0000-000000000008', 0.86, 4, 'orders@coolsys.nl'),
('b1000000-0000-0000-0000-000000000013', 'Milan TermoSys S.r.l.', 'a1000000-0000-0000-0000-000000000011', 0.83, 5, 'vendite@termosys.it'),
('b1000000-0000-0000-0000-000000000014', 'Gothenburg SteelFrame AB', 'a1000000-0000-0000-0000-000000000010', 0.94, 6, 'order@steelframe.se'),
('b1000000-0000-0000-0000-000000000015', 'Monterrey MetalWorks SA', 'a1000000-0000-0000-0000-000000000013', 0.79, 28, 'ventas@metalworks.mx'),
('b1000000-0000-0000-0000-000000000016', 'Wroclaw FrameTech Sp.', 'a1000000-0000-0000-0000-000000000009', 0.88, 4, 'sales@frametech.pl'),
('b1000000-0000-0000-0000-000000000017', 'Shanghai MembraTech', 'a1000000-0000-0000-0000-000000000001', 0.90, 18, 'b2b@membratech.cn'),
('b1000000-0000-0000-0000-000000000018', 'Osaka FilmCo Ltd.', 'a1000000-0000-0000-0000-000000000004', 0.91, 16, 'export@filmco.jp'),
('b1000000-0000-0000-0000-000000000019', 'Shenzhen ChemSol Ltd.', 'a1000000-0000-0000-0000-000000000005', 0.85, 20, 'info@chemsol.cn'),
('b1000000-0000-0000-0000-000000000020', 'Busan ChemTrade Corp.', 'a1000000-0000-0000-0000-000000000003', 0.89, 14, 'trade@chemtrade.kr'),
('b1000000-0000-0000-0000-000000000021', 'Taiwan SensorPro Inc.', 'a1000000-0000-0000-0000-000000000002', 0.93, 11, 'pro@sensorpro.tw'),
('b1000000-0000-0000-0000-000000000022', 'Gothenburg IoTech AB', 'a1000000-0000-0000-0000-000000000010', 0.90, 5, 'iot@iotech.se'),
('b1000000-0000-0000-0000-000000000023', 'Hamburg IsoTech GmbH', 'a1000000-0000-0000-0000-000000000007', 0.92, 2, 'kontakt@isotech.de'),
('b1000000-0000-0000-0000-000000000024', 'Vietnam ThermalPad JSC', 'a1000000-0000-0000-0000-000000000006', 0.81, 24, 'sales@thermalpad.vn'),
('b1000000-0000-0000-0000-000000000025', 'Wroclaw CopperTech Sp.', 'a1000000-0000-0000-0000-000000000009', 0.91, 3, 'copper@coppertech.pl'),
('b1000000-0000-0000-0000-000000000026', 'Detroit PowerBar LLC', 'a1000000-0000-0000-0000-000000000012', 0.83, 18, 'info@powerbar.us'),
('b1000000-0000-0000-0000-000000000027', 'Milan SealMaster S.r.l.', 'a1000000-0000-0000-0000-000000000011', 0.87, 5, 'ordini@sealmaster.it'),
('b1000000-0000-0000-0000-000000000028', 'Rotterdam RubberTech B.V.', 'a1000000-0000-0000-0000-000000000008', 0.85, 4, 'info@rubbertech.nl'),
('b1000000-0000-0000-0000-000000000029', 'Hamburg BondChem GmbH', 'a1000000-0000-0000-0000-000000000007', 0.93, 2, 'vertrieb@bondchem.de'),
('b1000000-0000-0000-0000-000000000030', 'Osaka AdhesivePro Ltd.', 'a1000000-0000-0000-0000-000000000004', 0.88, 16, 'sales@adhesivepro.jp');

-- ============================================================
-- PRODUCTS (20 — complete EV battery pack BOM)
-- ============================================================
INSERT INTO products (id, name, sku, category, unit_price, criticality) VALUES
('c1000000-0000-0000-0000-000000000001', 'Lithium Ion Cell 21700', 'LIC-21700-A', 'Battery Cells', 4.50, 'CRITICAL'),
('c1000000-0000-0000-0000-000000000002', 'Cell Separator Membrane', 'CSM-PE-01', 'Battery Cells', 1.20, 'CRITICAL'),
('c1000000-0000-0000-0000-000000000003', 'Liquid Electrolyte Solution', 'LES-LiPF6', 'Chemicals', 8.50, 'CRITICAL'),
('c1000000-0000-0000-0000-000000000004', 'BMS Control Chip v3', 'BMS-CHIP-V3', 'Electronics', 12.80, 'CRITICAL'),
('c1000000-0000-0000-0000-000000000005', 'Temperature Sensor Module', 'TSM-NTC-10K', 'Electronics', 3.20, 'HIGH'),
('c1000000-0000-0000-0000-000000000006', 'Voltage Monitoring IC', 'VM-IC-8S', 'Electronics', 6.40, 'HIGH'),
('c1000000-0000-0000-0000-000000000007', 'HV Wiring Harness Kit', 'WH-HV-KIT', 'Wiring', 28.50, 'HIGH'),
('c1000000-0000-0000-0000-000000000008', 'LV Signal Cable Set', 'LV-SIG-SET', 'Wiring', 12.00, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000009', 'Thermal Cooling Plate', 'TCP-ALU-200', 'Cooling Systems', 45.00, 'HIGH'),
('c1000000-0000-0000-0000-000000000010', 'Thermal Interface Pad', 'TIP-SIL-3MM', 'Cooling Systems', 2.80, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000011', 'Coolant Hose Assembly', 'CHA-EPDM-12', 'Cooling Systems', 15.00, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000012', 'Battery Housing Frame', 'BHF-STL-400', 'Structural', 120.00, 'HIGH'),
('c1000000-0000-0000-0000-000000000013', 'Module End Plate', 'MEP-ALU-100', 'Structural', 18.50, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000014', 'Copper Busbar Set', 'CBS-CU-HV', 'Power Distribution', 32.00, 'HIGH'),
('c1000000-0000-0000-0000-000000000015', 'HV Connector Male/Female', 'HVC-MF-200A', 'Power Distribution', 22.00, 'HIGH'),
('c1000000-0000-0000-0000-000000000016', 'Battery Pack Gasket', 'BPG-SILR-XL', 'Sealing', 8.00, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000017', 'IP67 Vent Valve', 'VV-IP67-M12', 'Sealing', 5.50, 'MEDIUM'),
('c1000000-0000-0000-0000-000000000018', 'Structural Adhesive Cartridge', 'SAC-EP-500', 'Bonding', 35.00, 'HIGH'),
('c1000000-0000-0000-0000-000000000019', 'Cell-to-Pack Bonding Film', 'CTP-BF-01', 'Bonding', 4.20, 'HIGH'),
('c1000000-0000-0000-0000-000000000020', 'Pyro Fuse (CID)', 'PF-CID-400A', 'Safety', 28.00, 'CRITICAL');

-- ============================================================
-- INVENTORY
-- ============================================================
INSERT INTO inventory (product_id, quantity_on_hand, daily_consumption_rate, reorder_point, max_capacity) VALUES
('c1000000-0000-0000-0000-000000000001', 8500, 2000, 6000, 50000),
('c1000000-0000-0000-0000-000000000002', 45000, 10000, 30000, 100000),
('c1000000-0000-0000-0000-000000000003', 2000, 800, 2400, 10000),
('c1000000-0000-0000-0000-000000000004', 1200, 500, 1500, 10000),
('c1000000-0000-0000-0000-000000000005', 3500, 500, 1500, 8000),
('c1000000-0000-0000-0000-000000000006', 2800, 500, 1500, 8000),
('c1000000-0000-0000-0000-000000000007', 3000, 400, 1200, 8000),
('c1000000-0000-0000-0000-000000000008', 5000, 400, 1200, 10000),
('c1000000-0000-0000-0000-000000000009', 600, 200, 400, 3000),
('c1000000-0000-0000-0000-000000000010', 8000, 1000, 3000, 20000),
('c1000000-0000-0000-0000-000000000011', 1500, 200, 600, 4000),
('c1000000-0000-0000-0000-000000000012', 250, 50, 100, 500),
('c1000000-0000-0000-0000-000000000013', 800, 100, 300, 2000),
('c1000000-0000-0000-0000-000000000014', 400, 200, 600, 2000),
('c1000000-0000-0000-0000-000000000015', 1000, 400, 1200, 4000),
('c1000000-0000-0000-0000-000000000016', 2000, 200, 600, 5000),
('c1000000-0000-0000-0000-000000000017', 3000, 200, 600, 6000),
('c1000000-0000-0000-0000-000000000018', 150, 50, 150, 500),
('c1000000-0000-0000-0000-000000000019', 10000, 2000, 6000, 30000),
('c1000000-0000-0000-0000-000000000020', 500, 100, 300, 2000);

-- ============================================================
-- SUPPLY ROUTES (50+)
-- ============================================================
INSERT INTO supply_routes (supplier_id, product_id, unit_cost, transit_route, transit_days, is_primary, hub_ports) VALUES
-- Lithium Ion Cell 21700
('b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 4.50, 'Shanghai → Suez Canal → Hamburg Port → Munich', 18, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 5.20, 'Busan → Rotterdam Port → Munich', 14, FALSE, '{"Rotterdam"}'),
('b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 5.00, 'Osaka → Suez Canal → Hamburg Port → Munich', 16, FALSE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 5.80, 'Shenzhen → Rotterdam Port → Munich', 22, FALSE, '{"Rotterdam"}'),
-- Cell Separator Membrane
('b1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000002', 1.20, 'Shanghai → Suez Canal → Hamburg Port → Munich', 18, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000002', 1.45, 'Osaka → Suez Canal → Hamburg Port → Munich', 16, FALSE, '{"Suez Canal","Hamburg"}'),
-- Liquid Electrolyte Solution
('b1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000003', 8.50, 'Shenzhen → Suez Canal → Hamburg Port → Munich', 20, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000003', 9.80, 'Busan → Rotterdam Port → Munich', 14, FALSE, '{"Rotterdam"}'),
-- BMS Control Chip v3
('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000004', 12.80, 'Taipei → Suez Canal → Hamburg Port → Munich', 12, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000004', 14.50, 'Busan → Rotterdam Port → Munich', 10, FALSE, '{"Rotterdam"}'),
('b1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000004', 15.20, 'Shenzhen → Suez Canal → Hamburg Port → Munich', 15, FALSE, '{"Suez Canal","Hamburg"}'),
-- Temperature Sensor Module
('b1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000005', 3.20, 'Taipei → Suez Canal → Hamburg Port → Munich', 11, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000005', 3.80, 'Gothenburg → Road → Munich', 5, FALSE, '{}'),
-- Voltage Monitoring IC
('b1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000006', 6.40, 'Taipei → Suez Canal → Hamburg Port → Munich', 12, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006', 7.20, 'Busan → Rotterdam Port → Munich', 10, FALSE, '{"Rotterdam"}'),
-- HV Wiring Harness Kit
('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000007', 28.50, 'Wroclaw → A4 Autobahn → Munich', 3, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000007', 42.00, 'Detroit → Air Freight → Frankfurt → Munich', 21, FALSE, '{"Frankfurt"}'),
('b1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000007', 32.00, 'Ho Chi Minh → Suez Canal → Hamburg Port → Munich', 22, FALSE, '{"Suez Canal","Hamburg"}'),
-- LV Signal Cable Set
('b1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000008', 12.00, 'Wroclaw → A4 Autobahn → Munich', 3, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000008', 14.50, 'Ho Chi Minh → Suez Canal → Hamburg Port → Munich', 22, FALSE, '{"Suez Canal","Hamburg"}'),
-- Thermal Cooling Plate
('b1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000009', 45.00, 'Hamburg → A7 Autobahn → Munich', 2, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000009', 48.50, 'Rotterdam → A3 Autobahn → Munich', 4, FALSE, '{}'),
('b1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000009', 52.00, 'Milan → Brenner Pass → Munich', 5, FALSE, '{}'),
-- Thermal Interface Pad
('b1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000010', 2.80, 'Hamburg → A7 Autobahn → Munich', 2, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000010', 3.50, 'Ho Chi Minh → Suez Canal → Hamburg Port → Munich', 24, FALSE, '{"Suez Canal","Hamburg"}'),
-- Coolant Hose Assembly
('b1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000011', 15.00, 'Rotterdam → A3 Autobahn → Munich', 4, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000011', 17.50, 'Milan → Brenner Pass → Munich', 5, FALSE, '{}'),
-- Battery Housing Frame
('b1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000012', 120.00, 'Gothenburg → Ferry → Kiel → Munich', 6, TRUE, '{"Kiel"}'),
('b1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000012', 145.00, 'Monterrey → Ship → Houston → Rotterdam → Munich', 28, FALSE, '{"Houston","Rotterdam"}'),
('b1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000012', 128.00, 'Wroclaw → A4 Autobahn → Munich', 4, FALSE, '{}'),
-- Module End Plate
('b1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000013', 18.50, 'Gothenburg → Ferry → Kiel → Munich', 6, TRUE, '{"Kiel"}'),
('b1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000013', 20.00, 'Wroclaw → A4 Autobahn → Munich', 4, FALSE, '{}'),
-- Copper Busbar Set
('b1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000014', 32.00, 'Wroclaw → A4 Autobahn → Munich', 3, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000026', 'c1000000-0000-0000-0000-000000000014', 38.00, 'Detroit → Air Freight → Frankfurt → Munich', 18, FALSE, '{"Frankfurt"}'),
-- HV Connector
('b1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000015', 22.00, 'Wroclaw → A4 Autobahn → Munich', 3, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000015', 28.00, 'Detroit → Air Freight → Frankfurt → Munich', 21, FALSE, '{"Frankfurt"}'),
-- Battery Pack Gasket
('b1000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000016', 8.00, 'Milan → Brenner Pass → Munich', 5, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000028', 'c1000000-0000-0000-0000-000000000016', 8.80, 'Rotterdam → A3 Autobahn → Munich', 4, FALSE, '{}'),
-- IP67 Vent Valve
('b1000000-0000-0000-0000-000000000028', 'c1000000-0000-0000-0000-000000000017', 5.50, 'Rotterdam → A3 Autobahn → Munich', 4, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000027', 'c1000000-0000-0000-0000-000000000017', 6.00, 'Milan → Brenner Pass → Munich', 5, FALSE, '{}'),
-- Structural Adhesive
('b1000000-0000-0000-0000-000000000029', 'c1000000-0000-0000-0000-000000000018', 35.00, 'Hamburg → A7 Autobahn → Munich', 2, TRUE, '{}'),
('b1000000-0000-0000-0000-000000000030', 'c1000000-0000-0000-0000-000000000018', 40.00, 'Osaka → Suez Canal → Hamburg Port → Munich', 16, FALSE, '{"Suez Canal","Hamburg"}'),
-- Cell-to-Pack Bonding Film
('b1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000019', 4.20, 'Shanghai → Suez Canal → Hamburg Port → Munich', 18, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000019', 4.80, 'Osaka → Suez Canal → Hamburg Port → Munich', 16, FALSE, '{"Suez Canal","Hamburg"}'),
-- Pyro Fuse CID
('b1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000020', 28.00, 'Taipei → Suez Canal → Hamburg Port → Munich', 11, TRUE, '{"Suez Canal","Hamburg"}'),
('b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000020', 32.00, 'Busan → Rotterdam Port → Munich', 10, FALSE, '{"Rotterdam"}');
