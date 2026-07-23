import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    variantSku: string;
    qty: number;
    price: number;
  }[];
  shippingAddress: any; // Would be typed properly in a real app
  billingAddress: any;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
  paymentGateway: string;
  paymentRef: string;
  orderStatus: string;
  trackingId: string;
  courier: string;
  couponApplied: string;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variantSku: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: { type: Schema.Types.Mixed },
    billingAddress: { type: Schema.Types.Mixed },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentGateway: { type: String, enum: ['razorpay', 'stripe'] },
    paymentRef: { type: String },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'returned', 'cancelled'],
      default: 'placed',
    },
    trackingId: { type: String },
    courier: { type: String },
    couponApplied: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
