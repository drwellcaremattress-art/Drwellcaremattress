import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: String, required: false },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    comment: { type: String, required: true, maxlength: 1000 },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
