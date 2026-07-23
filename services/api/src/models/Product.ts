import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  benefits: string[];
  images: { url: string; alt: string; position: number }[];
  variants: {
    size: string;
    dimensions: string;
    thickness_cm: number;
    price: number;
    mrp: number;
    sku: string;
    stock: number;
  }[];
  firmness: string;
  warranty_years: number;
  trialNights: number;
  ratingAvg: number;
  ratingCount: number;
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  status: string;
}

const ProductSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, default: 'Dr Well Care' },
    category: {
      type: String,
      enum: ['orthopaedic', 'memory-foam', 'hybrid', 'pocket-spring'],
      required: true,
    },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
        position: { type: Number },
      },
    ],
    variants: [
      {
        size: { type: String, enum: ['Single', 'Double', 'Queen', 'King'], required: true },
        dimensions: { type: String },
        thickness_cm: { type: Number },
        price: { type: Number, required: true },
        mrp: { type: Number },
        sku: { type: String, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
    firmness: {
      type: String,
      enum: ['Soft', 'Medium', 'Firm', 'Orthopaedic Firm'],
      required: true,
    },
    warranty_years: { type: Number, default: 10 },
    trialNights: { type: Number, default: 100 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    seo: {
      title: String,
      description: String,
      keywords: String,
    },
    status: {
      type: String,
      enum: ['active', 'draft'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
