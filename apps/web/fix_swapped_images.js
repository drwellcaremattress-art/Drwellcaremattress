import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    
    // Fix Mona Lite images
    const ml = await db.collection('products').findOne({ slug: 'mona-lite' });
    if (ml && ml.images && ml.images.length > 1) {
      const swapped = [ml.images[1], ml.images[0], ...ml.images.slice(2)];
      await db.collection('products').updateOne({ _id: ml._id }, { $set: { images: swapped } });
      console.log('Swapped Mona Lite images');
    }
    
    // Also Mona Softy just in case?
    const ms = await db.collection('products').findOne({ slug: 'mona-softy' });
    if (ms && ms.images && ms.images.length > 1) {
      const swapped2 = [ms.images[1], ms.images[0], ...ms.images.slice(2)];
      await db.collection('products').updateOne({ _id: ms._id }, { $set: { images: swapped2 } });
      console.log('Swapped Mona Softy images');
    }
    
  } finally {
    await client.close();
  }
}
run();
