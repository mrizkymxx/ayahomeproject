-- Harden CRUD policies to require authenticated admin_users membership

-- Remove insecure public CRUD policies (if present)
DROP POLICY IF EXISTS "Public can insert categories" ON categories;
DROP POLICY IF EXISTS "Public can update categories" ON categories;
DROP POLICY IF EXISTS "Public can delete categories" ON categories;
DROP POLICY IF EXISTS "Public can insert products" ON products;
DROP POLICY IF EXISTS "Public can update products" ON products;
DROP POLICY IF EXISTS "Public can delete products" ON products;
DROP POLICY IF EXISTS "Public can insert articles" ON articles;
DROP POLICY IF EXISTS "Public can update articles" ON articles;
DROP POLICY IF EXISTS "Public can delete articles" ON articles;

-- Helper expression reused in policies:
-- EXISTS (SELECT 1 FROM public.admin_users au WHERE au.user_id = auth.uid())

-- Categories
CREATE POLICY "Admin can insert categories"
ON categories FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can update categories"
ON categories FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can delete categories"
ON categories FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

-- Products
CREATE POLICY "Admin can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can update products"
ON products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can delete products"
ON products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

-- Articles
CREATE POLICY "Admin can insert articles"
ON articles FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can update articles"
ON articles FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin can delete articles"
ON articles FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

-- Storage objects: tighten write access to authenticated admin users only
DROP POLICY IF EXISTS "Public upload products images" ON storage.objects;
DROP POLICY IF EXISTS "Public update products images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete products images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload articles images" ON storage.objects;
DROP POLICY IF EXISTS "Public update articles images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete articles images" ON storage.objects;

CREATE POLICY "Admin upload products images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin update products images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'products'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin delete products images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin upload articles images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'articles'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin update articles images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'articles'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
)
WITH CHECK (
  bucket_id = 'articles'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);

CREATE POLICY "Admin delete articles images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'articles'
  AND EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.user_id = auth.uid()
  )
);
