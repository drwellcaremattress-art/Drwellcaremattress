import { MongoClient } from 'mongodb';

const URI = 'mongodb://drwellcaremattress_db_user:KdYnZHXQGZg5dqbS@ac-hflzr3p-shard-00-00.kjr319d.mongodb.net:27017,ac-hflzr3p-shard-00-01.kjr319d.mongodb.net:27017,ac-hflzr3p-shard-00-02.kjr319d.mongodb.net:27017/drwellcare?ssl=true&authSource=admin&retryWrites=true&w=majority';

async function check() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db();
  
  const products = await db.collection('products').find({}).toArray();
  for (const p of products) {
    console.log(`Slug: ${p.slug}, Firmness: ${p.firmness}`);
  }
  
  await client.close();
}

check().catch(console.error);
