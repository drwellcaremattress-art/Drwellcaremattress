require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { Product } = require('./src/lib/models/Product.ts'); // This will fail in plain node because it's TypeScript. We should compile it on the fly or just redefine the schema.

// Let's redefine the schema exactly as it is in the file to test Mongoose behavior
const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  variants: [
    {
      size: { type: String, required: true },
      dimensions: { type: String },
      thickness_cm: { type: Number },
      price: { type: Number, required: true },
      mrp: { type: Number },
      sku: { type: String, required: true },
      stock: { type: Number, default: 0 },
      image: { type: String },
      subDimensions: [
        {
          dim: { type: String, required: true },
          sqft: { type: Number, required: true },
        },
      ],
    },
  ],
}, { strict: false });

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');
  
  // 1. Fetch
  let p = await ProductModel.findOne();
  if (!p) return console.log('No product found');
  
  const slug = p.slug;
  console.log('Testing on slug:', slug);
  
  // 2. Modify
  const payload = JSON.parse(JSON.stringify(p));
  if (!payload.variants || payload.variants.length === 0) {
    payload.variants = [{ size: 'Single', price: 1000, sku: 'TEST' }];
  }
  
  payload.variants[0].subDimensions = [
    { dim: '99x99', sqft: 99.99 }
  ];
  
  // 3. Update via mongoose (simulate API)
  const updatedProduct = await ProductModel.findOneAndUpdate(
    { slug },
    { $set: payload },
    { new: true, runValidators: true }
  );
  
  console.log('Updated Document Variants:', JSON.stringify(updatedProduct.variants[0], null, 2));
  
  // 4. Fetch again to verify persistence
  const check = await ProductModel.findOne({ slug });
  console.log('Persisted Document Variants:', JSON.stringify(check.variants[0], null, 2));
  
  process.exit(0);
}

run().catch(console.error);
