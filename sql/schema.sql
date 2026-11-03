-- ====================================================================
-- AI-POWERED FACIAL EXPRESSION ANALYSIS PLATFORM
-- PostgreSQL Database DDL Schema (Google Cloud SQL / Supabase)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. Table: profiles (User Profile synchronized with Supabase Auth)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_user_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_supabase_user_id ON public.profiles(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- --------------------------------------------------------------------
-- 2. Table: analysis_sessions (High-level facial expression sessions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_started_at TIMESTAMPTZ NOT NULL,
    session_ended_at TIMESTAMPTZ NOT NULL,
    dominant_expression TEXT NOT NULL,
    average_confidence NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    total_frames_analyzed INTEGER NOT NULL DEFAULT 0,
    expression_distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON public.analysis_sessions(session_started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_dominant_expr ON public.analysis_sessions(dominant_expression);

-- --------------------------------------------------------------------
-- 3. Table: expression_results (Detailed temporal frame aggregations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expression_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
    expression_label TEXT NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_expression_results_session_id ON public.expression_results(session_id);

-- --------------------------------------------------------------------
-- 4. Table: user_preferences (Camera & analysis preferences)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    camera_preference JSONB NOT NULL DEFAULT '{"preferredDeviceId": null, "mirrorMode": true, "showLandmarks": true}'::jsonb,
    analysis_preferences JSONB NOT NULL DEFAULT '{"smoothingFactor": 0.35, "inferenceFps": 30, "minConfidence": 0.4}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- --------------------------------------------------------------------
-- 5. Table: consent_records (Explicit privacy & camera permissions audit)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL, -- 'CAMERA_PROCESSING', 'SESSION_STATS_STORAGE', 'PRIVACY_POLICY'
    consent_status BOOLEAN NOT NULL DEFAULT TRUE,
    ip_hash TEXT,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records(user_id);

-- --------------------------------------------------------------------
-- 6. Trigger: Auto update updated_at timestamp
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
