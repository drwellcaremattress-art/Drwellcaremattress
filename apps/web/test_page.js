import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    
    // Simulate what page.tsx does for slug 'lax-o-bond'
    let slug = 'lax-o-bond';
    let dbProduct = await db.collection('products').findOne({ slug });
    if (!dbProduct) {
       // wait, what if Next.js slug was 'lax-o-bond'?
       console.log("No product found for slug lax-o-bond");
    }
    
    // Let's check 'lax-o-bond-8'
    let dbProduct8 = await db.collection('products').findOne({ slug: 'lax-o-bond-8' });
    console.log("8-inch variants:", dbProduct8.variants.length);

    // Let's check how the user could see TWO buttons!
    // Maybe they grouped products by name in the DB?
    const group = await db.collection('products').find({ name: 'Lax-o-Bond' }).toArray();
    console.log("Group by name:", group.length, group.map(g => g.slug));
  } finally {
    await client.close();
  }
}
run();
