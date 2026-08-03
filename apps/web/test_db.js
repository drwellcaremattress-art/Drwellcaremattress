import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const p = await db.collection('products').findOne({ slug: 'lax-o-bond-8' });
    console.log(JSON.stringify(p.images, null, 2));
    
    // Also check product card image which is used in Collections page
    // Wait, the collections page uses the first image of the product.
  } finally {
    await client.close();
  }
}
run();
