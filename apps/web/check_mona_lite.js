import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db();
    const p = await db.collection('products').findOne({ slug: 'mona-lite' });
    console.log(JSON.stringify(p, null, 2));
  } finally {
    await client.close();
  }
}
run();
