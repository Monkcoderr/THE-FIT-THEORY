/**
 * One-time data reset script — wipes all DUMMY business data for a fresh start.
 *
 * Clears these collections:
 *   - products    (catalog + stock variants)
 *   - salerecords (sales / revenue / profit history)
 *   - invoices    (customer data, revenue, profit)
 *   - auditlogs   (billing audit trail)
 *   - counters    (invoice-number sequence — reset so numbering starts fresh)
 *
 * It does NOT touch any application code, schemas, indexes, or your admin
 * password / env config. The collections remain (with their indexes) — only
 * the documents inside them are removed.
 *
 * Usage:  node scripts/reset-data.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// --- Load MONGO_URI from .env.local (no dotenv dependency in this project) ---
function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    // Strip surrounding quotes if present
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

const COLLECTIONS = [
  'products',
  'salerecords',
  'invoices',
  'auditlogs',
  'counters',
];

async function main() {
  loadEnvLocal();

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI not found in .env.local');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  console.log(`Connected to database: "${db.databaseName}"\n`);

  // Show what exists before deletion
  const existing = await db.listCollections().toArray();
  const existingNames = new Set(existing.map((c) => c.name));

  console.log('Clearing dummy data...\n');
  for (const name of COLLECTIONS) {
    if (!existingNames.has(name)) {
      console.log(`  • ${name}: (collection does not exist — skipped)`);
      continue;
    }
    const before = await db.collection(name).countDocuments();
    const res = await db.collection(name).deleteMany({});
    console.log(`  • ${name}: removed ${res.deletedCount} of ${before} documents`);
  }

  console.log('\n✅ Done. All dummy products, stock, sales, invoices,');
  console.log('   customer data, revenue, profit, and audit logs are cleared.');
  console.log('   Schemas and indexes are intact — your app is ready for a fresh start.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('\n❌ Reset failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch (_) {}
  process.exit(1);
});
