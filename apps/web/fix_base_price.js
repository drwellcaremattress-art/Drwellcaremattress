import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({}).toArray();
    for (let p of products) {
      if (p.variants && p.variants.length > 0) {
        // Sort variants by thickness ascending
        p.variants.sort((a, b) => a.thickness_cm - b.thickness_cm);
        const leastVariant = p.variants[0];
        
        const updates = {
          price: leastVariant.price,
          originalPrice: leastVariant.mrp
        };
        
        if (leastVariant.image) {
          // If the variant has an image, ensure it is the first image in the product's images array
          const newImages = [leastVariant.image, ...(p.images || []).filter(img => img !== leastVariant.image)];
          updates.images = newImages;
        }
        
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: updates }
        );
      }
    }
    console.log('Fixed DB base price and images to least thickness variant!');
  } finally {
    await client.close();
  }
}
run();
