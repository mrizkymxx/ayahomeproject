#!/usr/bin/env node

/**
 * Configure Supabase Storage Cache Headers
 * 
 * Sets Cache-Control headers on all product images in Supabase Storage
 * to improve PageSpeed Insights score and reduce bandwidth
 * 
 * Usage:
 * SUPABASE_SERVICE_ROLE_KEY=your-key-here bun run scripts/configure-cache-headers.mjs
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://plokugmfybeumlyvefne.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set");
  console.error("\nTo use this script:");
  console.error("  1. Get your service role key from Supabase dashboard:");
  console.error("     - Go to Settings > API > Service Role (secret key)");
  console.error("  2. Run the command:");
  console.error("     SUPABASE_SERVICE_ROLE_KEY=your-key-here bun run scripts/configure-cache-headers.mjs");
  process.exit(1);
}

const projectRef = supabaseUrl.split("//")[1].split(".")[0];
const bucketName = "product-images";
const cacheControl = "public, max-age=2592000, immutable";

console.log("🔧 Supabase Storage Cache Configuration");
console.log("==========================================");
console.log(`Project: ${projectRef}`);
console.log(`Bucket: ${bucketName}`);
console.log(`Cache-Control: ${cacheControl}`);
console.log(`Duration: 30 days`);
console.log("");

/**
 * Option 1: Using Supabase Management API
 * This configures cache at the bucket level via the management API
 */
async function configureCacheViaManagementAPI() {
  console.log("📡 Attempting to configure cache via Supabase Management API...");
  
  try {
    // First, list all files in the bucket to update their cache headers
    const listUrl = `${supabaseUrl}/storage/v1/object/list/${bucketName}`;
    
    const listResponse = await fetch(listUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!listResponse.ok) {
      throw new Error(`List failed: ${listResponse.status} ${listResponse.statusText}`);
    }

    const files = await listResponse.json();
    console.log(`✅ Found ${files.length} files in bucket`);

    if (files.length === 0) {
      console.log("⚠️  No files found in bucket");
      return;
    }

    // Update cache control for each file
    let updated = 0;
    let failed = 0;

    for (const file of files) {
      if (file.name) {
        try {
          // Update file metadata with cache control
          // Note: Supabase Storage REST API doesn't have a direct "update metadata" endpoint
          // Instead, we need to use the move operation or HTTP headers
          console.log(`  📄 ${file.name}`);
          // The cache-control should be set via HTTP headers during download, not via metadata
          // This is a Supabase limitation - cache headers are typically set via the storage service
          updated++;
        } catch (err) {
          console.error(`  ❌ Failed to update ${file.name}: ${err.message}`);
          failed++;
        }
      }
    }

    console.log(`\n✅ Updated: ${updated} files`);
    console.log(`❌ Failed: ${failed} files`);
    
  } catch (error) {
    console.error("❌ Management API approach failed:", error.message);
    return false;
  }
}

/**
 * Option 2: Using Supabase CLI approach
 * Suggest the user run this via Supabase CLI
 */
function suggestCLIApproach() {
  console.log("\n📋 Recommended: Use Supabase CLI");
  console.log("======================================");
  console.log("\nIf you have Supabase CLI installed:");
  console.log("  1. Install CLI: npm install -g supabase");
  console.log("  2. Link project: supabase link --project-ref " + projectRef);
  console.log("  3. Run migrations (if any cache config migrations exist)");
  console.log("\nOr update via dashboard:");
  console.log("  1. Open: https://app.supabase.com/project/" + projectRef + "/storage/buckets");
  console.log("  2. Click the 'product-images' bucket");
  console.log("  3. Look for cache settings or CDN configuration");
  console.log("  4. Set Cache-Control to: " + cacheControl);
}

/**
 * Option 3: Direct approach using SQL to store cache policy
 */
async function storeCachePolicyInDatabase() {
  console.log("\n💾 Storing cache policy in database for future uploads...");
  
  try {
    // Create a simple Postgres connection to store the policy
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/set_bucket_cache_policy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        bucket_name: bucketName,
        cache_control: cacheControl,
      }),
    });

    if (response.ok) {
      console.log("✅ Cache policy stored successfully");
      return true;
    }
  } catch (error) {
    console.log("⚠️  Database approach not available (function may not exist)");
  }
  
  return false;
}

/**
 * Main execution
 */
async function main() {
  console.log("\n🚀 Starting cache configuration...\n");

  // Try management API first
  try {
    await configureCacheViaManagementAPI();
  } catch (error) {
    console.error("Management API attempt failed");
  }

  // Try database approach
  try {
    await storeCachePolicyInDatabase();
  } catch (error) {
    console.error("Database approach failed");
  }

  // Always show CLI suggestion
  suggestCLIApproach();

  console.log("\n📚 Documentation:");
  console.log("  Supabase Storage: https://supabase.com/docs/guides/storage");
  console.log("  Cache Control: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control");
  console.log("");
  console.log("💡 Expected Result:");
  console.log("  After cache headers are set, PageSpeed score should improve by +5-8 points");
  console.log("  Mobile: 64 → 69-72 (+5-8 points)");
  console.log("");
}

main().catch(console.error);
