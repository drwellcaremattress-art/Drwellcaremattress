import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    console.log(`Total DB products: ${products.length}`);
    for (let p of products) {
      console.log(`\n--- Product: [${p.slug}] "${p.name}" ---`);
      console.log(`Price: ${p.price}, SqftPrice: ${p.sqftPrice}, Thickness: ${p.thickness}`);
      console.log(`Images (${p.images?.length || 0}):`);
      p.images?.forEach((img, i) => {
        const url = typeof img === 'string' ? img : img.url;
        console.log(`  [${i}]: ${url}`);
      });
      console.log(`Variants (${p.variants?.length || 0}):`);
      p.variants?.forEach((v, i) => {
        console.log(`  [${i}]: thickness_cm=${v.thickness_cm}, price=${v.price}, mrp=${v.mrp}, image=${v.image || 'NONE'}`);
      });
    }
  } finally {
    await client.close();
  }
}
run();
