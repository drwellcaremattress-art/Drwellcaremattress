import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const products = await db.collection('products').find({ name: { $regex: 'Natural Latex', $options: 'i' } }).toArray();
    console.log(JSON.stringify(products, null, 2));
  } finally {
    await client.close();
  }
}
run();
