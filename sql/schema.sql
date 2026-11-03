-- ====================================================================
-- BMKG Real-Time Seismik & Tsunami Early Warning Database Schema
-- Supabase PostgreSQL DDL
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. Tabel Utama: earthquakes (Katalog Seismik Indonesia)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.earthquakes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    bmkg_id TEXT UNIQUE,
    event_time TIMESTAMPTZ NOT NULL,
    date_str TEXT NOT NULL,
    time_str TEXT NOT NULL,
    latitude NUMERIC(7, 4) NOT NULL,
    longitude NUMERIC(7, 4) NOT NULL,
    coordinates_str TEXT NOT NULL,
    magnitude NUMERIC(3, 1) NOT NULL,
    depth_km NUMERIC(6, 1) NOT NULL,
    region TEXT NOT NULL,
    potency TEXT NOT NULL DEFAULT 'Tidak berpotensi tsunami',
    felt_mmi TEXT,
    shakemap_url TEXT,
    category TEXT NOT NULL DEFAULT 'M5+', -- 'LATEST', 'M5+', 'FELT'
    is_simulation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indeks performa query seismik
CREATE INDEX IF NOT EXISTS idx_earthquakes_event_time ON public.earthquakes(event_time DESC);
CREATE INDEX IF NOT EXISTS idx_earthquakes_magnitude ON public.earthquakes(magnitude DESC);
CREATE INDEX IF NOT EXISTS idx_earthquakes_category ON public.earthquakes(category);
CREATE INDEX IF NOT EXISTS idx_earthquakes_simulation ON public.earthquakes(is_simulation);

-- --------------------------------------------------------------------
-- 2. Tabel Telemetri Sinkronisasi BMKG: sync_telemetry
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_source TEXT NOT NULL,
    status TEXT NOT NULL, -- 'SUCCESS', 'FAILED', 'PARTIAL'
    items_synced INTEGER NOT NULL DEFAULT 0,
    response_time_ms INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    synced_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sync_telemetry_synced_at ON public.sync_telemetry(synced_at DESC);

-- --------------------------------------------------------------------
-- 3. Tabel Skenario Simulasi: simulation_state
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.simulation_state (
    id TEXT PRIMARY KEY DEFAULT 'active_scenario',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    scenario_name TEXT,
    simulated_earthquake JSONB,
    activated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Inisialisasi baris tunggal simulation state
INSERT INTO public.simulation_state (id, is_active, scenario_name)
VALUES ('active_scenario', FALSE, 'Default (Real-Time BMKG)')
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 4. Row Level Security (RLS) & Kebijakan Akses
-- --------------------------------------------------------------------
ALTER TABLE public.earthquakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_state ENABLE ROW LEVEL SECURITY;

-- Kebijakan Baca Terbuka (Public Read)
CREATE POLICY "Public read earthquakes"
ON public.earthquakes FOR SELECT
USING (true);

CREATE POLICY "Public read sync telemetry"
ON public.sync_telemetry FOR SELECT
USING (true);

CREATE POLICY "Public read simulation state"
ON public.simulation_state FOR SELECT
USING (true);

-- Kebijakan Tulis Server (Service Role / Backend Route Handlers)
CREATE POLICY "Allow server to insert earthquakes"
ON public.earthquakes FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow server to write telemetry"
ON public.sync_telemetry FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow server to update simulation"
ON public.simulation_state FOR ALL
USING (true)
WITH CHECK (true);
