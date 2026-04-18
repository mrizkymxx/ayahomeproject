-- Migration: Configure storage cache control headers
-- Purpose: Set up CDN cache policies for Supabase Storage bucket
-- Date: 2026-04-18
-- 
-- This migration creates a table to track cache policies and a function
-- that can be called via Supabase RPC to configure storage cache headers

-- Create a table to store cache policies
CREATE TABLE IF NOT EXISTS public.storage_cache_policies (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bucket_name TEXT NOT NULL UNIQUE,
  cache_control TEXT NOT NULL,
  max_age_seconds INT DEFAULT 2592000,
  is_immutable BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Add RLS policy
ALTER TABLE public.storage_cache_policies ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to manage cache policies
CREATE POLICY "Allow service role to manage cache policies"
  ON public.storage_cache_policies
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Create policy to allow public read-only access
CREATE POLICY "Allow public to view cache policies"
  ON public.storage_cache_policies
  FOR SELECT
  USING (is_public);

-- Create function to set cache policy
CREATE OR REPLACE FUNCTION public.set_storage_cache_control(
  p_bucket_name TEXT,
  p_cache_control TEXT DEFAULT 'public, max-age=2592000, immutable'
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  bucket_name TEXT,
  cache_control TEXT,
  configured_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_max_age INT;
  v_is_immutable BOOLEAN;
  v_is_public BOOLEAN;
BEGIN
  -- Parse cache control string
  v_is_public := p_cache_control ILIKE '%public%';
  v_is_immutable := p_cache_control ILIKE '%immutable%';
  
  -- Extract max-age if present
  v_max_age := COALESCE(
    (regexp_matches(p_cache_control, 'max-age=(\d+)', 'g'))[1]::INT,
    2592000
  );

  -- Insert or update cache policy
  INSERT INTO public.storage_cache_policies (
    bucket_name,
    cache_control,
    max_age_seconds,
    is_immutable,
    is_public,
    enabled,
    notes
  ) VALUES (
    p_bucket_name,
    p_cache_control,
    v_max_age,
    v_is_immutable,
    v_is_public,
    TRUE,
    'Configured via RPC function'
  )
  ON CONFLICT (bucket_name) DO UPDATE
  SET 
    cache_control = p_cache_control,
    max_age_seconds = v_max_age,
    is_immutable = v_is_immutable,
    is_public = v_is_public,
    updated_at = NOW();

  RETURN QUERY
  SELECT 
    true::BOOLEAN as success,
    'Cache policy configured successfully'::TEXT as message,
    p_bucket_name::TEXT as bucket_name,
    p_cache_control::TEXT as cache_control,
    NOW() as configured_at;

EXCEPTION WHEN OTHERS THEN
  RETURN QUERY
  SELECT 
    false::BOOLEAN as success,
    ('Error: ' || SQLERRM)::TEXT as message,
    p_bucket_name::TEXT as bucket_name,
    p_cache_control::TEXT as cache_control,
    NOW() as configured_at;
END;
$$;

-- Create function to get cache policy for a bucket
CREATE OR REPLACE FUNCTION public.get_storage_cache_policy(p_bucket_name TEXT)
RETURNS TABLE (
  bucket_name TEXT,
  cache_control TEXT,
  max_age_seconds INT,
  is_immutable BOOLEAN,
  is_public BOOLEAN,
  enabled BOOLEAN,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    storage_cache_policies.bucket_name,
    storage_cache_policies.cache_control,
    storage_cache_policies.max_age_seconds,
    storage_cache_policies.is_immutable,
    storage_cache_policies.is_public,
    storage_cache_policies.enabled,
    storage_cache_policies.updated_at
  FROM public.storage_cache_policies
  WHERE storage_cache_policies.bucket_name = p_bucket_name
  AND storage_cache_policies.enabled = TRUE;
END;
$$;

-- Insert default cache policy for product-images bucket
INSERT INTO public.storage_cache_policies (
  bucket_name,
  cache_control,
  max_age_seconds,
  is_immutable,
  is_public,
  enabled,
  notes
) VALUES (
  'product-images',
  'public, max-age=2592000, immutable',
  2592000,
  TRUE,
  TRUE,
  TRUE,
  'Default cache policy for product images - 30 day browser cache'
)
ON CONFLICT (bucket_name) DO NOTHING;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_storage_cache_policies_enabled
  ON public.storage_cache_policies(enabled)
  WHERE enabled = TRUE;

-- Add comment
COMMENT ON TABLE public.storage_cache_policies IS 'Stores CDN cache control policies for Supabase Storage buckets. Used to configure Cache-Control headers for performance optimization.';

COMMENT ON FUNCTION public.set_storage_cache_control(TEXT, TEXT) IS 'Sets cache control policy for a storage bucket. Can be called via MCP RPC. Parameters: bucket_name (TEXT), cache_control (TEXT default: "public, max-age=2592000, immutable")';

COMMENT ON FUNCTION public.get_storage_cache_policy(TEXT) IS 'Gets the current cache control policy for a storage bucket. Parameters: bucket_name (TEXT)';
