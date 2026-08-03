import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    for (const p of products) {
      console.log(`Product: ${p.name} (slug: ${p.slug})`);
      console.log(`Images:`, p.images?.length || 0);
      if (p.images && p.images.length > 0) {
        console.log(`  First image:`, p.images[0].url || p.images[0]);
      }
    }
  } finally {
    await client.close();
  }
}
run();
