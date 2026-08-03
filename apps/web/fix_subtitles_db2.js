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
      if (p.description && p.description.match(/ - \d+ Inch/)) {
        const newDesc = p.description.replace(/ - \d+ Inch/g, '');
        await db.collection('products').updateOne(
          { _id: p._id },
          { $set: { description: newDesc } }
        );
      }
    }
    console.log('Fixed DB descriptions!');
  } finally {
    await client.close();
  }
}
run();
