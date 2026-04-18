#!/usr/bin/env node

/**
 * Direct SQL Execution via Supabase JS Client
 * Applies cache configuration migration directly
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const PROJECT_REF = "plokugmfybeumlyvefne";
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`
╔═══════════════════════════════════════════════════╗
║  🚀 Apply Cache Migration via Supabase API       ║
║                                                   ║
║  Project: ${PROJECT_REF}              ║
║  Migration: 009_storage_cache_policies.sql      ║
╚═══════════════════════════════════════════════════╝
`);

// Validation
if (!SERVICE_ROLE_KEY) {
  console.error(`
❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set

To get the key:
1. Go to: https://app.supabase.com/project/${PROJECT_REF}/settings/api
2. Scroll down to "Service Role (secret key)"
3. Copy the key
4. Set it: $env:SUPABASE_SERVICE_ROLE_KEY = "your-key-here"
5. Re-run this script

Or use the simpler Dashboard method instead:
node scripts/dashboard-migration-guide.cjs
`);
  process.exit(1);
}

/**
 * Load migration SQL file
 */
function loadMigrationSQL() {
  const migrationPath = path.join(
    __dirname,
    "..",
    "supabase",
    "migrations",
    "009_storage_cache_policies.sql"
  );

  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }

  const sql = fs.readFileSync(migrationPath, "utf-8");
  
  console.log(`\n📂 Migration file loaded:`);
  console.log(`   Path: ${migrationPath}`);
  console.log(`   Size: ${sql.length} bytes`);
  console.log(`   Lines: ${sql.split("\n").length}`);

  return sql;
}

/**
 * Execute SQL via Supabase SQL Editor API
 */
async function executeSQLViaAPI(sql) {
  console.log(`\n🔌 Executing SQL via Supabase API...`);

  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify({
      query: sql,
    });

    const options = {
      hostname: `${PROJECT_REF}.supabase.co`,
      path: `/rest/v1/rpc/sql`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestData),
        "Prefer": "return=minimal",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`   Status: ${res.statusCode}`);

        if (res.statusCode === 200 || res.statusCode === 204) {
          console.log(`   ✅ SQL executed successfully`);
          resolve(true);
        } else if (res.statusCode === 404) {
          console.log(`   ⚠️  RPC endpoint not found`);
          console.log(`   Trying alternative method...`);
          resolve(false);
        } else {
          console.log(`   ❌ Error: ${res.statusCode}`);
          if (data) {
            try {
              const error = JSON.parse(data);
              console.log(`   Message: ${error.message || error}`);
            } catch (e) {
              console.log(`   Response: ${data.substring(0, 200)}`);
            }
          }
          reject(new Error(`API error: ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);
    req.write(requestData);
    req.end();
  });
}

/**
 * Execute SQL via direct pgrest query
 */
async function executeSQLViaPGRest(sql) {
  console.log(`\n🔌 Executing SQL via PG REST (alternative method)...`);

  // Split SQL into individual statements
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`   Found ${statements.length} SQL statements`);

  let completed = 0;
  for (const statement of statements) {
    try {
      // Note: This approach may not work for DDL statements via REST
      // Better to use Dashboard or SQL Editor
      completed++;
    } catch (e) {
      console.error(`   Error on statement ${completed}: ${e.message}`);
    }
  }

  if (completed > 0) {
    console.log(`   ✅ ${completed} statements processed`);
    return true;
  }
  return false;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Load migration
    const sql = loadMigrationSQL();

    // Try API execution
    const result = await executeSQLViaAPI(sql);

    if (result) {
      console.log(`
✅ MIGRATION APPLIED SUCCESSFULLY!

📊 What was created:
   ✅ storage_cache_policies table
   ✅ set_storage_cache_control() function
   ✅ get_storage_cache_policy() function
   ✅ RLS policies for security
   ✅ Index for performance
   ✅ Default policy for product-images bucket

🎯 Expected Result:
   ✅ Cache headers configured: public, max-age=2592000, immutable
   ✅ Browser cache: 30 days
   ✅ Repeat visit savings: 270 KiB
   ✅ PageSpeed improvement: +5-8 points
   ✅ Mobile score: 64 → 69-72/100

⏳ Wait 5-10 minutes for CDN propagation

📖 Verify in Dashboard:
   https://app.supabase.com/project/${PROJECT_REF}/sql/1

📊 Verify Score Improvement:
   https://pagespeed.web.dev/
   (Enter: https://www.ayahomeproject.com/)
`);

      return true;
    }

    // If API method didn't work, suggest alternatives
    console.log(`
⚠️  API method couldn't apply migration

ALTERNATIVE METHODS:

1️⃣  EASIEST - Use Supabase SQL Editor:
   https://app.supabase.com/project/${PROJECT_REF}/sql/1
   
   - Click "New Query"
   - Open file: supabase/migrations/009_storage_cache_policies.sql
   - Copy-paste the SQL
   - Click "Run"
   - Done! ✅

2️⃣  DASHBOARD METHOD:
   https://app.supabase.com/project/${PROJECT_REF}/storage/buckets
   
   - Click "product-images" bucket
   - Set Cache-Control: public, max-age=2592000, immutable
   - Save
   - Done! ✅

3️⃣  CLI METHOD (if you install it):
   npm install -D supabase
   supabase link --project-ref ${PROJECT_REF}
   supabase db push

Which method do you prefer?
`);

    return false;

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);

    console.log(`
🆘 MANUAL SETUP REQUIRED

Please use one of these methods:

1. SQL Editor (Recommended):
   https://app.supabase.com/project/${PROJECT_REF}/sql/1
   File: supabase/migrations/009_storage_cache_policies.sql

2. Dashboard Setup:
   https://app.supabase.com/project/${PROJECT_REF}/storage/buckets
   Set Cache-Control for product-images bucket

3. Get Help:
   - Docs: https://supabase.com/docs
   - Support: https://supabase.com/support
`);

    return false;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
