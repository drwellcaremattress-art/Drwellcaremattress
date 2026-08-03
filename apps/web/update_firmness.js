import { MongoClient } from 'mongodb';

const URI = 'mongodb://drwellcaremattress_db_user:KdYnZHXQGZg5dqbS@ac-hflzr3p-shard-00-00.kjr319d.mongodb.net:27017,ac-hflzr3p-shard-00-01.kjr319d.mongodb.net:27017,ac-hflzr3p-shard-00-02.kjr319d.mongodb.net:27017/drwellcare?ssl=true&authSource=admin&retryWrites=true&w=majority';

const FIRMNESS_UPDATES = [
  // Soft
  { match: { slug: { $regex: /memory-dump/ } }, firmness: 'Soft' },
  { match: { slug: { $regex: /^luxoria$/ } }, firmness: 'Soft' },
  { match: { slug: { $regex: /luxoria-latex/ } }, firmness: 'Soft' },
  
  // Medium Soft
  { match: { slug: { $regex: /lax-o-bond/ } }, firmness: 'Medium Soft' },
  { match: { slug: { $regex: /memory-bond/ } }, firmness: 'Medium Soft' },
  { match: { slug: { $regex: /natural-latex/ } }, firmness: 'Medium Soft' },

  // Medium Firm
  { match: { slug: { $regex: /ecolatex/ } }, firmness: 'Medium Firm' },
  { match: { slug: { $regex: /softy-bond/ } }, firmness: 'Medium Firm' },
  { match: { slug: { $regex: /mona-softy/ } }, firmness: 'Medium Firm' },

  // Firm
  { match: { slug: { $regex: /mona-lite/ } }, firmness: 'Firm' }
];

async function updateDB() {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db();

  console.log('Updating firmness in DB...');
  let totalUpdated = 0;

  for (const update of FIRMNESS_UPDATES) {
    const result = await db.collection('products').updateMany(update.match, { $set: { firmness: update.firmness } });
    console.log(`Updated ${result.modifiedCount} products for filter:`, update.match, '->', update.firmness);
    totalUpdated += result.modifiedCount;
  }

  console.log(`Total products updated: ${totalUpdated}`);
  await client.close();
}

updateDB().catch(console.error);
