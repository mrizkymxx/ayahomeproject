-- Fix admin auth check visibility for authenticated users.
-- Keep admin list private: users can only read their own row.

DROP POLICY IF EXISTS "No public read admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated can read own admin row" ON public.admin_users;
DROP POLICY IF EXISTS "Admin read own row" ON public.admin_users;

CREATE POLICY "Authenticated can read own admin row"
ON public.admin_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "No public read admin users"
ON public.admin_users
FOR SELECT
TO anon
USING (false);
