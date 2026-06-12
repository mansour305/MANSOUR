-- Migration: Create push_subscriptions table for Web Push notifications
-- Phase 15: Web Push Foundation
-- Date: 2026-06-12
-- Security: RLS enabled, users can only manage their own subscriptions

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, endpoint)
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- 1. Users can INSERT their own subscriptions
CREATE POLICY "Users can insert their own push subscriptions"
    ON push_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 2. Users can SELECT their own subscriptions
CREATE POLICY "Users can select their own push subscriptions"
    ON push_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- 3. Users can UPDATE their own subscriptions
CREATE POLICY "Users can update their own push subscriptions"
    ON push_subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 4. Users can DELETE their own subscriptions
CREATE POLICY "Users can delete their own push subscriptions"
    ON push_subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);

-- 5. Admins can view all subscriptions (for sending notifications)
-- This is handled via service_role or a specific admin function
-- Not exposing full admin access via RLS for security

-- Add comment for documentation
COMMENT ON TABLE push_subscriptions IS 'Web Push notification subscriptions for users. Stores VAPID subscription data for sending push notifications when app is closed.';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Push subscription endpoint URL from browser';
COMMENT ON COLUMN push_subscriptions.p256dh IS 'Public key for push encryption (p256dh)';
COMMENT ON COLUMN push_subscriptions.auth IS 'Authentication secret for push encryption';

-- Function to clean up old subscriptions (optional maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_push_subscriptions(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM push_subscriptions
    WHERE created_at < NOW() - (days_old || ' days')::INTERVAL
    AND endpoint NOT IN (
        SELECT DISTINCT endpoint FROM push_subscriptions
        WHERE created_at >= NOW() - (days_old || ' days')::INTERVAL
    );
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admin should be able to run cleanup
-- Comment out until admin role is properly defined
-- GRANT EXECUTE ON FUNCTION cleanup_old_push_subscriptions TO authenticated;