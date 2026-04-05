-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES
('Bed', 'bed', 'Comfortable and stylish beds'),
('Sofas', 'sofas', 'Elegant sofas for your living room'),
('Table', 'table', 'Dining and coffee tables'),
('Chair', 'chair', 'Comfortable chairs for every room'),
('Dining Set', 'dining-set', 'Complete dining room sets'),
('Coffee Table', 'coffee-table', 'Stylish coffee tables');

-- Get category IDs for reference
DO $$
DECLARE
  chair_id UUID;
BEGIN
  SELECT id INTO chair_id FROM categories WHERE slug = 'chair';

  -- Seed Products (using Chair category)
  INSERT INTO products (name, slug, category_id, description, images, is_best_seller, specifications) VALUES
  (
    'Afra Chair',
    'afra-chair',
    chair_id,
    'The Afra Chair combines modern design with exceptional comfort. Crafted with premium materials and attention to detail, this chair is perfect for both dining and office spaces. Its elegant silhouette and durable construction make it a timeless addition to any interior.',
    ARRAY['/assets/products/afra-chair.jpg'],
    true,
    '{"Material": "Premium Teak Wood", "Dimensions": "45cm x 50cm x 85cm", "Weight": "8 kg", "Color Options": "Natural, Walnut, White", "Warranty": "1 Year"}'::jsonb
  ),
  (
    'Yola Chair',
    'yola-chair',
    chair_id,
    'Experience ultimate comfort with the Yola Chair. This beautifully crafted piece features ergonomic design and premium upholstery, making it perfect for long hours of sitting. Whether for your dining room or home office, the Yola Chair delivers both style and functionality.',
    ARRAY['/assets/products/yola-chair.jpg'],
    false,
    '{"Material": "Mahogany Wood & Fabric", "Dimensions": "48cm x 52cm x 88cm", "Weight": "9 kg", "Color Options": "Beige, Gray, Navy", "Warranty": "1 Year"}'::jsonb
  ),
  (
    'Landa Chair',
    'landa-chair',
    chair_id,
    'The Landa Chair is a masterpiece of minimalist design. With clean lines and expert craftsmanship, this chair brings sophistication to any space. Its lightweight yet sturdy construction makes it versatile for various settings.',
    ARRAY['/assets/products/landa-chair.jpg'],
    true,
    '{"Material": "Oak Wood", "Dimensions": "42cm x 48cm x 82cm", "Weight": "7 kg", "Color Options": "Natural, Black, Espresso", "Warranty": "1 Year"}'::jsonb
  ),
  (
    'Briliy Chair',
    'briliy-chair',
    chair_id,
    'Add a touch of elegance to your home with the Briliy Chair. This contemporary design features smooth curves and a comfortable seat, making it ideal for modern interiors. Built to last with quality materials and expert joinery.',
    ARRAY['/assets/products/briliy-chair.jpg'],
    false,
    '{"Material": "Walnut Wood", "Dimensions": "46cm x 51cm x 86cm", "Weight": "8.5 kg", "Color Options": "Walnut, Honey, White Oak", "Warranty": "1 Year"}'::jsonb
  ),
  (
    'Yantam Chair',
    'yantam-chair',
    chair_id,
    'The Yantam Chair showcases traditional craftsmanship with a modern twist. Handcrafted by skilled artisans, this chair combines comfort and durability. Perfect for creating a warm, inviting atmosphere in your dining area.',
    ARRAY['/assets/products/yantam-chair.jpg'],
    true,
    '{"Material": "Teak Wood", "Dimensions": "44cm x 49cm x 84cm", "Weight": "8 kg", "Color Options": "Natural Teak, Dark Walnut", "Warranty": "1 Year"}'::jsonb
  ),
  (
    'Gunaw Chair',
    'gunaw-chair',
    chair_id,
    'Discover comfort redefined with the Gunaw Chair. This versatile piece features a sturdy frame and ergonomic design that provides excellent back support. Suitable for dining rooms, offices, or as an accent chair in your living space.',
    ARRAY['/assets/products/gunaw-chair.jpg'],
    false,
    '{"Material": "Mahogany Wood", "Dimensions": "47cm x 50cm x 87cm", "Weight": "9 kg", "Color Options": "Cherry, Natural, Black", "Warranty": "1 Year"}'::jsonb
  );
END $$;

-- Seed Articles
INSERT INTO articles (title, slug, excerpt, content, category, read_time, image_url, is_featured, published_at) VALUES
(
  'Secrets You Should Know For Those of You Who Have a Small Room',
  'small-room-secrets',
  'Discover expert tips and tricks to maximize your small room space. Learn how to make your compact living area feel spacious, organized, and stylish with smart furniture choices and clever design solutions.',
  '<p>Living in a small room doesn''t mean you have to compromise on style or functionality. With the right approach, you can transform even the tiniest space into a comfortable and beautiful living area.</p>

<h2>1. Choose Multi-Functional Furniture</h2>
<p>Invest in furniture that serves multiple purposes. A bed with built-in storage, a coffee table that doubles as a desk, or an ottoman with hidden compartments can help you maximize every square inch of your space.</p>

<h2>2. Use Vertical Space</h2>
<p>Don''t forget about your walls! Floating shelves, wall-mounted desks, and tall bookcases draw the eye upward and make the room feel larger while providing valuable storage.</p>

<h2>3. Keep It Light and Bright</h2>
<p>Light colors make spaces feel more open and airy. Choose a light color palette for your walls and furniture, and maximize natural light with sheer curtains or blinds.</p>

<h2>4. Mirrors Are Your Friend</h2>
<p>Strategic placement of mirrors can make a room feel twice as large by reflecting light and creating the illusion of depth.</p>

<h2>5. Scale Matters</h2>
<p>Choose furniture that''s appropriately scaled for your space. Oversized pieces will make a small room feel cramped, while furniture that''s too small can look awkward.</p>

<p>At Aya Home Project, we specialize in creating custom pieces that perfectly fit your space and lifestyle. Contact us today for a free consultation!</p>',
  'Interior Tips',
  '5 min read',
  '/assets/generated/small-room.jpg',
  true,
  '2025-08-06 10:00:00+00'
),
(
  'Wall Paint vs Furniture Finish Should They Match',
  'wall-paint-furniture-finish',
  'Explore the art of color coordination in interior design. Understand when to match and when to contrast your wall colors with furniture finishes for a harmonious living space.',
  '<p>One of the most common questions in interior design is whether your wall paint should match your furniture finish. The answer isn''t always straightforward, as it depends on your design goals and personal preferences.</p>

<h2>The Matching Approach</h2>
<p>Matching your wall paint to your furniture finish creates a cohesive, monochromatic look. This approach works well in:</p>
<ul>
<li>Small spaces where you want to minimize visual clutter</li>
<li>Minimalist or modern interiors</li>
<li>Rooms where you want furniture to blend seamlessly</li>
</ul>

<h2>The Contrasting Approach</h2>
<p>Contrasting colors can make your furniture stand out and add visual interest. This works when:</p>
<ul>
<li>You want your furniture to be a focal point</li>
<li>Creating a bold, dramatic look</li>
<li>Working with neutral furniture against colored walls (or vice versa)</li>
</ul>

<h2>The Complementary Approach</h2>
<p>The middle ground involves choosing colors that complement rather than match or contrast sharply. This is often the safest and most popular choice.</p>

<h2>Professional Tips</h2>
<p>Consider the undertones of both your wall paint and furniture finish. Warm undertones should generally pair with warm undertones, and cool with cool. Test paint samples next to your furniture before committing.</p>

<p>Need help choosing the perfect furniture finish for your space? Our design team at Aya Home Project can guide you through the selection process.</p>',
  'Design Guide',
  '4 min read',
  '/assets/generated/wall-paint.jpg',
  false,
  '2025-08-07 10:00:00+00'
),
(
  'Moldy Furniture? Find Out The Causes and How to Fix It!',
  'moldy-furniture-solutions',
  'Learn the root causes of mold on furniture and effective solutions to prevent and treat it. Keep your furniture looking fresh and extend its lifespan with proper care techniques.',
  '<p>Discovering mold on your beautiful furniture can be disheartening, but understanding the causes and solutions can help you prevent and treat this common problem.</p>

<h2>What Causes Mold on Furniture?</h2>
<p>Mold thrives in environments with:</p>
<ul>
<li>High humidity (above 60%)</li>
<li>Poor air circulation</li>
<li>Darkness</li>
<li>Organic materials (wood, fabric, leather)</li>
</ul>

<h2>Prevention is Key</h2>
<p>The best approach to mold is preventing it in the first place:</p>
<ul>
<li>Maintain indoor humidity between 30-50%</li>
<li>Ensure proper ventilation in all rooms</li>
<li>Keep furniture away from walls to allow air circulation</li>
<li>Use dehumidifiers in damp areas</li>
<li>Clean and dust furniture regularly</li>
</ul>

<h2>How to Remove Mold</h2>
<p>For wood furniture:</p>
<ol>
<li>Move the furniture outdoors or to a well-ventilated area</li>
<li>Vacuum the mold with a HEPA filter vacuum</li>
<li>Wipe with a solution of mild soap and water</li>
<li>For stubborn mold, use a 1:10 bleach-water solution</li>
<li>Dry completely before bringing back inside</li>
</ol>

<p>For upholstered furniture, professional cleaning may be necessary for severe cases.</p>

<h2>Long-Term Care</h2>
<p>Regular maintenance and proper environmental conditions will keep your furniture mold-free. Our furniture at Aya Home Project is treated with protective finishes, but proper care is still essential.</p>

<p>Questions about furniture care? Contact our customer service team for expert advice!</p>',
  'Maintenance',
  '6 min read',
  '/assets/generated/moldy-furniture.jpg',
  false,
  '2025-08-08 10:00:00+00'
);

-- Seed Projects
INSERT INTO projects (title, location, description, images, client_type, completion_date) VALUES
(
  'Hotels & Cafés Sumbawa',
  'Sumbawa, Indonesia',
  'Custom furniture solutions for luxury hotels and cafés in Sumbawa, featuring modern designs with traditional Indonesian touches.',
  ARRAY[
    '/assets/generated/hotel-sumbawa-01.jpg',
    '/assets/generated/hotel-sumbawa-02.jpg',
    '/assets/generated/hotel-sumbawa-03.jpg'
  ],
  'Hospitality',
  '2024-06-15'
),
(
  'Sushi Restaurants Bali',
  'Uluwatu & Seminyak, Bali',
  'Sleek, contemporary furniture for upscale sushi restaurants in Bali''s most prestigious locations. Combining functionality with aesthetic appeal.',
  ARRAY[
    '/assets/generated/sushi-bali-01.jpg',
    '/assets/generated/sushi-bali-02.jpg',
    '/assets/generated/sushi-bali-03.jpg'
  ],
  'Restaurant',
  '2024-09-20'
);
