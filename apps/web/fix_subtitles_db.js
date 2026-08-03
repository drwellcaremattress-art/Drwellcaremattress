require('dotenv').config({ path: '../../.env' });
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function fixDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  const Product = require('./src/lib/models/Product').Product;
  
  const products = await Product.find({});
  for (let p of products) {
    if (p.description && p.description.match(/ - \d+ Inch/)) {
      p.description = p.description.replace(/ - \d+ Inch/g, '');
      await p.save();
    }
  }
  console.log('Fixed DB subtitles');
  process.exit(0);
}
fixDB();
