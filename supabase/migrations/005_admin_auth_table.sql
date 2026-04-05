-- Admin allow-list table linked to Supabase Auth users
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No public read admin users" ON public.admin_users;
DROP POLICY IF EXISTS "No public insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "No public update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "No public delete admin users" ON public.admin_users;

CREATE POLICY "No public read admin users"
ON public.admin_users FOR SELECT
TO public
USING (false);

CREATE POLICY "No public insert admin users"
ON public.admin_users FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "No public update admin users"
ON public.admin_users FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "No public delete admin users"
ON public.admin_users FOR DELETE
TO public
USING (false);
