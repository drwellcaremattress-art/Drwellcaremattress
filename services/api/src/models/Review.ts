import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verifiedPurchase: boolean;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    body: { type: String, required: true },
    images: [{ type: String }],
    verifiedPurchase: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
