-- Ensure public buckets for admin image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('articles', 'articles', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Products bucket policies
DROP POLICY IF EXISTS "Public read products images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload products images" ON storage.objects;
DROP POLICY IF EXISTS "Public update products images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete products images" ON storage.objects;

CREATE POLICY "Public read products images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Public upload products images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public update products images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Public delete products images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'products');

-- Articles bucket policies
DROP POLICY IF EXISTS "Public read articles images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload articles images" ON storage.objects;
DROP POLICY IF EXISTS "Public update articles images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete articles images" ON storage.objects;

CREATE POLICY "Public read articles images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'articles');

CREATE POLICY "Public upload articles images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'articles');

CREATE POLICY "Public update articles images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'articles')
WITH CHECK (bucket_id = 'articles');

CREATE POLICY "Public delete articles images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'articles');
