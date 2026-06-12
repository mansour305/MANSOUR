-- Migration: Create goals, cost_projects, cost_items, reminders tables
-- Phase 16: Full Web/PWA Production System (Fixed RLS)
-- Date: 2026-06-12
-- Security: RLS enabled with proper admin role checks

-- =============================================================================
-- HELPER FUNCTION: Admin Role Check
-- =============================================================================

CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    SELECT up.role INTO user_role
    FROM public.user_profiles up
    WHERE up.user_id = auth.uid()
    LIMIT 1;
    
    RETURN user_role IN ('admin', 'super_admin', 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

COMMENT ON FUNCTION public.has_admin_role() IS 
'Check if the authenticated user has an admin role (admin, super_admin, or owner)';

-- =============================================================================
-- SECTION 1: GOALS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('financial', 'non-financial')),
    target_amount NUMERIC(15, 2),
    requirements TEXT,
    current_progress NUMERIC(15, 2) DEFAULT 0,
    deadline DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_completed ON public.goals(completed_at) WHERE completed_at IS NULL;

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals FORCE ROW LEVEL SECURITY;

-- Users can only manage their own goals
CREATE POLICY "Users manage own goals"
    ON public.goals FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.goals IS 'User goals (financial or non-financial) for tracking progress';

-- =============================================================================
-- SECTION 2: COST PROJECTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.cost_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cost_projects_user_id ON public.cost_projects(user_id);

ALTER TABLE public.cost_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_projects FORCE ROW LEVEL SECURITY;

-- Users can only manage their own cost projects
CREATE POLICY "Users manage own cost projects"
    ON public.cost_projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.cost_projects IS 'Cost tracking projects (e.g., wedding, car repair, travel)';

-- =============================================================================
-- SECTION 3: COST ITEMS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.cost_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.cost_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (amount > 0),
    paid_amount NUMERIC(15, 2) DEFAULT 0 CHECK (paid_amount >= 0),
    remaining_amount NUMERIC(15, 2) GENERATED ALWAYS AS (amount - paid_amount) STORED,
    status TEXT NOT NULL DEFAULT 'partial' CHECK (status IN ('partial', 'fully_paid', 'scheduled')),
    scheduled_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_paid_not_exceed_amount CHECK (paid_amount <= amount)
);

CREATE INDEX IF NOT EXISTS idx_cost_items_project_id ON public.cost_items(project_id);
CREATE INDEX IF NOT EXISTS idx_cost_items_user_id ON public.cost_items(user_id);

ALTER TABLE public.cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_items FORCE ROW LEVEL SECURITY;

-- Users can only manage their own cost items
CREATE POLICY "Users manage own cost items"
    ON public.cost_items FOR ALL
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1
            FROM public.cost_projects p
            WHERE p.id = project_id
            AND p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1
            FROM public.cost_projects p
            WHERE p.id = project_id
            AND p.user_id = auth.uid()
        )
    );

COMMENT ON TABLE public.cost_items IS 'Individual items within a cost project';

-- =============================================================================
-- SECTION 4: REMINDERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date_type TEXT NOT NULL DEFAULT 'gregorian' CHECK (date_type IN ('gregorian')),
    reminder_date DATE NOT NULL,
    reminder_time TIME,
    remind_before_value INTEGER DEFAULT 0 CHECK (remind_before_value >= 0),
    remind_before_unit TEXT DEFAULT 'hours' CHECK (remind_before_unit IN ('minutes', 'hours', 'days')),
    note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_sent BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON public.reminders(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled ON public.reminders(scheduled_at) WHERE scheduled_at IS NOT NULL;

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders FORCE ROW LEVEL SECURITY;

-- Users can only manage their own reminders
CREATE POLICY "Users manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

COMMENT ON TABLE public.reminders IS 'User reminders with Gregorian date support only until a verified Hijri converter is added';

-- =============================================================================
-- SECTION 5: SYSTEM HEALTH LOGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_key TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'broken', 'fixed')),
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT,
    metadata JSONB,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_health_system_key ON public.system_health_logs(system_key);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health_logs(status);
CREATE INDEX IF NOT EXISTS idx_system_health_detected ON public.system_health_logs(detected_at);

ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_logs FORCE ROW LEVEL SECURITY;

-- Admin-only read (for admin dashboard display)
CREATE POLICY "Admins can view system health logs"
    ON public.system_health_logs FOR SELECT
    USING (public.has_admin_role());

-- Only admins can insert health logs (internal monitoring)
CREATE POLICY "Admins can insert system health logs"
    ON public.system_health_logs FOR INSERT
    WITH CHECK (public.has_admin_role());

-- Only admins can update/delete health logs
CREATE POLICY "Admins can manage system health logs"
    ON public.system_health_logs FOR UPDATE
    USING (public.has_admin_role())
    WITH CHECK (public.has_admin_role());

CREATE POLICY "Admins can delete system health logs"
    ON public.system_health_logs FOR DELETE
    USING (public.has_admin_role());

COMMENT ON TABLE public.system_health_logs IS 'System health monitoring logs (admin only)';

-- =============================================================================
-- SECTION 6: APP VERSIONS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.app_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version TEXT NOT NULL,
    build_number TEXT,
    release_type TEXT CHECK (release_type IN ('patch', 'minor', 'major', 'hotfix')),
    changelog TEXT,
    is_force_update BOOLEAN DEFAULT FALSE,
    min_supported_version TEXT,
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_versions_version ON public.app_versions(version);
CREATE INDEX IF NOT EXISTS idx_app_versions_published ON public.app_versions(published_at DESC);

ALTER TABLE public.app_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_versions FORCE ROW LEVEL SECURITY;

-- Public can read app versions (for PWA update check)
CREATE POLICY "Anyone can view app versions"
    ON public.app_versions FOR SELECT
    USING (true);

-- Only admins can insert/update app versions
CREATE POLICY "Admins can manage app versions"
    ON public.app_versions FOR ALL
    USING (public.has_admin_role())
    WITH CHECK (public.has_admin_role());

COMMENT ON TABLE public.app_versions IS 'App version registry for update notifications';

-- =============================================================================
-- SECTION 7: FEATURE HEALTH LOGS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.feature_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'broken', 'fixed')),
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT,
    route TEXT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fixed_at TIMESTAMPTZ,
    auto_fix_attempted BOOLEAN DEFAULT FALSE,
    auto_fix_result TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_health_key ON public.feature_health_logs(feature_key);
CREATE INDEX IF NOT EXISTS idx_feature_health_status ON public.feature_health_logs(status);
CREATE INDEX IF NOT EXISTS idx_feature_health_detected ON public.feature_health_logs(detected_at);

ALTER TABLE public.feature_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_health_logs FORCE ROW LEVEL SECURITY;

-- Admin-only read (for admin dashboard)
CREATE POLICY "Admins can view feature health logs"
    ON public.feature_health_logs FOR SELECT
    USING (public.has_admin_role());

-- Only admins can insert health logs (internal monitoring)
CREATE POLICY "Admins can insert feature health logs"
    ON public.feature_health_logs FOR INSERT
    WITH CHECK (public.has_admin_role());

-- Only admins can update/delete health logs
CREATE POLICY "Admins can manage feature health logs"
    ON public.feature_health_logs FOR UPDATE
    USING (public.has_admin_role())
    WITH CHECK (public.has_admin_role());

CREATE POLICY "Admins can delete feature health logs"
    ON public.feature_health_logs FOR DELETE
    USING (public.has_admin_role());

COMMENT ON TABLE public.feature_health_logs IS 'Feature health monitoring logs (admin only)';

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_goals_updated_at ON public.goals;
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cost_projects_updated_at ON public.cost_projects;
CREATE TRIGGER update_cost_projects_updated_at BEFORE UPDATE ON public.cost_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cost_items_updated_at ON public.cost_items;
CREATE TRIGGER update_cost_items_updated_at BEFORE UPDATE ON public.cost_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reminders_updated_at ON public.reminders;
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
