import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// 1. Inisialisasi Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Gagal! SUPABASE URL atau SERVICE ROLE KEY belum ada di .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Path Konfigurasi Ekstraksi INSSIST
const inssistDir = path.join('C:', 'Users', 'M RIZKY', 'Downloads', 'INSSIST', '@ayahomeproject.id');
const jsonPath = path.join(inssistDir, 'ayahomeproject.id.json');

async function main() {
  console.log("Membaca file INSSIST JSON...");
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  const posts = data.data.posts;
  // Memfilter: Minimal ada 2 gambar (Carousel)
  const targetPosts = posts.filter(p => p.files && p.files.length >= 2);
  
  console.log(`Ditemukan ${targetPosts.length} produk yang memiliki 2 gambar atau lebih.`);
  console.log("Memulai proses unggah ke Storage dan Database...\n");

  // Pastikan Storage Bucket 'product-images' ada / public
  const bucketName = 'product-images';
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === bucketName)) {
    console.log(`Membuat bucket publik '${bucketName}'...`);
    await supabase.storage.createBucket(bucketName, { public: true });
  }

  // Siapkan Array Error Tracking
  let counter = 1;
  const failList = [];

  for (const post of targetPosts) {
    process.stdout.write(`Upload Produk nomor "${counter}" (ID Post: ${post.id})... `);
    const publicUrls = [];
    let isUploadFailed = false;

    // Loop File Gambar
    for (let i = 0; i < post.files.length; i++) {
      const relativeFilePath = post.files[i]; 
      // Karena file hasil INSSIST format namanya "posts/[timestamp] tgl #01.jpg"
      const filePath = path.join(inssistDir, relativeFilePath);
      
      if (!fs.existsSync(filePath)) {
         console.warn(`[!] File hilang: ${filePath}`);
         continue;
      }
      
      const fileExt = path.extname(filePath);
      const fileName = `${post.id}/img_${i + 1}${fileExt}`;
      const fileBuffer = fs.readFileSync(filePath);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) {
        console.error(`[X] Gagal Upload Storage:`, uploadError.message);
        isUploadFailed = true;
        break;
      }

      // Ambil Public URL
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
      publicUrls.push(publicUrlData.publicUrl);
    }

    if (isUploadFailed || publicUrls.length === 0) {
       console.log('Dibatalkan ke Database karena error Storage.');
       failList.push(counter);
       continue;
    }

    // 3. Masukkan ke tabel `products` (Sesuai schema aktual DB)
    const dbRecord = {
      name: String(counter),
      slug: String(counter),
      description: null, 
      specifications: {}, 
      images: publicUrls
    };

    const { error: dbError } = await supabase.from('products').insert(dbRecord);
    if (dbError) {
      console.log(`\n[X] Gagal Insert DB Produk "${counter}":`, dbError.message);
      failList.push(counter);
    } else {
      console.log(`BERHASIL (${publicUrls.length} gambar).`);
    }

    counter++;
  }

  console.log("\n=================================");
  console.log(`SELESAI! Total diproses: ${targetPosts.length}`);
  if (failList.length > 0) {
      console.log(`Gagal: ${failList.length} (Produk nomor: ${failList.join(', ')})`);
  } else {
      console.log("Status: 100% SUKSES SEMPURNA.");
  }
}

main().catch(console.error);
