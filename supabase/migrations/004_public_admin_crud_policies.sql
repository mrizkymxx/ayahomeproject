-- Public CRUD policies for lightweight admin flow using anon key.
-- NOTE: For production, replace with authenticated/role-based policies.

-- Categories table
DROP POLICY IF EXISTS "Public can insert categories" ON categories;
DROP POLICY IF EXISTS "Public can update categories" ON categories;
DROP POLICY IF EXISTS "Public can delete categories" ON categories;

CREATE POLICY "Public can insert categories"
ON categories FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can update categories"
ON categories FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete categories"
ON categories FOR DELETE
TO public
USING (true);

-- Products table
DROP POLICY IF EXISTS "Public can insert products" ON products;
DROP POLICY IF EXISTS "Public can update products" ON products;
DROP POLICY IF EXISTS "Public can delete products" ON products;

CREATE POLICY "Public can insert products"
ON products FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can update products"
ON products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete products"
ON products FOR DELETE
TO public
USING (true);

-- Articles table
DROP POLICY IF EXISTS "Public can insert articles" ON articles;
DROP POLICY IF EXISTS "Public can update articles" ON articles;
DROP POLICY IF EXISTS "Public can delete articles" ON articles;

CREATE POLICY "Public can insert articles"
ON articles FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Public can update articles"
ON articles FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Public can delete articles"
ON articles FOR DELETE
TO public
USING (true);
