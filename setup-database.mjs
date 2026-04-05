import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase env vars.");
  console.error(
    "Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function setupDatabase() {
  console.log('🚀 Setting up Supabase database...\n');

  try {
    // Step 1: Create Categories
    console.log('📁 Creating categories...');
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert([
        { name: 'Bed', slug: 'bed', description: 'Comfortable and stylish beds' },
        { name: 'Sofas', slug: 'sofas', description: 'Elegant sofas for your living room' },
        { name: 'Table', slug: 'table', description: 'Dining and coffee tables' },
        { name: 'Chair', slug: 'chair', description: 'Comfortable chairs for every room' },
        { name: 'Dining Set', slug: 'dining-set', description: 'Complete dining room sets' },
        { name: 'Coffee Table', slug: 'coffee-table', description: 'Stylish coffee tables' },
      ])
      .select();

    if (catError) throw catError;
    console.log(`✅ Created ${categories.length} categories\n`);

    // Get Chair category ID
    const chairCategory = categories.find(c => c.slug === 'chair');

    // Step 2: Create Products
    console.log('🪑 Creating products...');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Afra Chair',
          slug: 'afra-chair',
          category_id: chairCategory.id,
          description: 'The Afra Chair combines modern design with exceptional comfort. Crafted with premium materials and attention to detail, this chair is perfect for both dining and office spaces.',
          images: ['/src/assets/products/afra-chair.jpg'],
          is_best_seller: true,
          specifications: {
            'Material': 'Premium Teak Wood',
            'Dimensions': '45cm x 50cm x 85cm',
            'Weight': '8 kg',
            'Color Options': 'Natural, Walnut, White',
            'Warranty': '1 Year'
          }
        },
        {
          name: 'Yola Chair',
          slug: 'yola-chair',
          category_id: chairCategory.id,
          description: 'Experience ultimate comfort with the Yola Chair. This beautifully crafted piece features ergonomic design and premium upholstery.',
          images: ['/src/assets/products/yola-chair.jpg'],
          is_best_seller: false,
          specifications: {
            'Material': 'Mahogany Wood & Fabric',
            'Dimensions': '48cm x 52cm x 88cm',
            'Weight': '9 kg',
            'Color Options': 'Beige, Gray, Navy',
            'Warranty': '1 Year'
          }
        },
        {
          name: 'Landa Chair',
          slug: 'landa-chair',
          category_id: chairCategory.id,
          description: 'The Landa Chair is a masterpiece of minimalist design. With clean lines and expert craftsmanship, this chair brings sophistication to any space.',
          images: ['/src/assets/products/landa-chair.jpg'],
          is_best_seller: true,
          specifications: {
            'Material': 'Oak Wood',
            'Dimensions': '42cm x 48cm x 82cm',
            'Weight': '7 kg',
            'Color Options': 'Natural, Black, Espresso',
            'Warranty': '1 Year'
          }
        },
        {
          name: 'Briliy Chair',
          slug: 'briliy-chair',
          category_id: chairCategory.id,
          description: 'Add a touch of elegance to your home with the Briliy Chair. This contemporary design features smooth curves and a comfortable seat.',
          images: ['/src/assets/products/briliy-chair.jpg'],
          is_best_seller: false,
          specifications: {
            'Material': 'Walnut Wood',
            'Dimensions': '46cm x 51cm x 86cm',
            'Weight': '8.5 kg',
            'Color Options': 'Walnut, Honey, White Oak',
            'Warranty': '1 Year'
          }
        },
        {
          name: 'Yantam Chair',
          slug: 'yantam-chair',
          category_id: chairCategory.id,
          description: 'The Yantam Chair showcases traditional craftsmanship with a modern twist. Handcrafted by skilled artisans.',
          images: ['/src/assets/products/yantam-chair.jpg'],
          is_best_seller: true,
          specifications: {
            'Material': 'Teak Wood',
            'Dimensions': '44cm x 49cm x 84cm',
            'Weight': '8 kg',
            'Color Options': 'Natural Teak, Dark Walnut',
            'Warranty': '1 Year'
          }
        },
        {
          name: 'Gunaw Chair',
          slug: 'gunaw-chair',
          category_id: chairCategory.id,
          description: 'Discover comfort redefined with the Gunaw Chair. This versatile piece features a sturdy frame and ergonomic design.',
          images: ['/src/assets/products/gunaw-chair.jpg'],
          is_best_seller: false,
          specifications: {
            'Material': 'Mahogany Wood',
            'Dimensions': '47cm x 50cm x 87cm',
            'Weight': '9 kg',
            'Color Options': 'Cherry, Natural, Black',
            'Warranty': '1 Year'
          }
        },
      ])
      .select();

    if (prodError) throw prodError;
    console.log(`✅ Created ${products.length} products\n`);

    // Step 3: Create Articles
    console.log('📝 Creating articles...');
    const { data: articles, error: artError } = await supabase
      .from('articles')
      .insert([
        {
          title: 'Secrets You Should Know For Those of You Who Have a Small Room',
          slug: 'small-room-secrets',
          excerpt: 'Discover expert tips and tricks to maximize your small room space.',
          content: '<p>Living in a small room doesn\'t mean you have to compromise on style...</p>',
          category: 'Interior Tips',
          read_time: '5 min read',
          image_url: '/src/assets/generated/small-room.jpg',
          is_featured: true,
          published_at: '2025-08-06T10:00:00Z'
        },
        {
          title: 'Wall Paint vs Furniture Finish Should They Match',
          slug: 'wall-paint-furniture-finish',
          excerpt: 'Explore the art of color coordination in interior design.',
          content: '<p>One of the most common questions in interior design...</p>',
          category: 'Design Guide',
          read_time: '4 min read',
          image_url: '/src/assets/generated/wall-paint.jpg',
          is_featured: false,
          published_at: '2025-08-07T10:00:00Z'
        },
        {
          title: 'Moldy Furniture? Find Out The Causes and How to Fix It!',
          slug: 'moldy-furniture-solutions',
          excerpt: 'Learn the root causes of mold on furniture and effective solutions.',
          content: '<p>Discovering mold on your beautiful furniture can be disheartening...</p>',
          category: 'Maintenance',
          read_time: '6 min read',
          image_url: '/src/assets/generated/moldy-furniture.jpg',
          is_featured: false,
          published_at: '2025-08-08T10:00:00Z'
        },
      ])
      .select();

    if (artError) throw artError;
    console.log(`✅ Created ${articles.length} articles\n`);

    // Step 4: Create Projects
    console.log('🏗️ Creating projects...');
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .insert([
        {
          title: 'Hotels & Cafés Sumbawa',
          location: 'Sumbawa, Indonesia',
          description: 'Custom furniture solutions for luxury hotels and cafés',
          images: [
            '/src/assets/generated/hotel-sumbawa-01.jpg',
            '/src/assets/generated/hotel-sumbawa-02.jpg',
            '/src/assets/generated/hotel-sumbawa-03.jpg',
          ],
          client_type: 'Hospitality',
          completion_date: '2024-06-15'
        },
        {
          title: 'Sushi Restaurants Bali',
          location: 'Uluwatu & Seminyak, Bali',
          description: 'Sleek, contemporary furniture for upscale sushi restaurants',
          images: [
            '/src/assets/generated/sushi-bali-01.jpg',
            '/src/assets/generated/sushi-bali-02.jpg',
            '/src/assets/generated/sushi-bali-03.jpg',
          ],
          client_type: 'Restaurant',
          completion_date: '2024-09-20'
        },
      ])
      .select();

    if (projError) throw projError;
    console.log(`✅ Created ${projects.length} projects\n`);

    console.log('✅ Database setup complete!');
    console.log('\nℹ️  You can now use the Supabase client in your frontend to fetch data.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
