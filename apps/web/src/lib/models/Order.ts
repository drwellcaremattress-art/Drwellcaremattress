import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  customerName?: string;
  customerPhone?: string;
  items: {
    productId?: string;
    name?: string;
    variantSku?: string;
    color?: string;
    qty: number;
    price: number;
    image?: string;
  }[];
  shippingAddress: any;
  billingAddress: any;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  advanceAmount?: number;
  balanceAmount?: number;
  paymentStatus: string;
  paymentGateway: string;
  paymentMethod: string;
  paymentRef: string;
  orderStatus: string;
  trackingId?: string;
  courier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  couponApplied?: string;
  dealerId?: mongoose.Types.ObjectId;
  dealerName?: string;
  dealerStoreName?: string;
  dealerPhone?: string;
  dealerEmail?: string;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    userEmail: { type: String, required: false },
    customerName: { type: String },
    customerPhone: { type: String },
    dealerId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    dealerName: { type: String, required: false },
    dealerStoreName: { type: String, required: false },
    dealerPhone: { type: String, required: false },
    dealerEmail: { type: String, required: false },
    items: [
      {
        productId: { type: String, required: false },
        name: { type: String },
        variantSku: { type: String },
        color: { type: String },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String }
      },
    ],
    shippingAddress: { type: Schema.Types.Mixed },
    billingAddress: { type: Schema.Types.Mixed },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    advanceAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      default: 'pending',
    },
    paymentGateway: { type: String, default: 'razorpay' },
    paymentMethod: { type: String, default: 'razorpay' },
    paymentRef: { type: String },
    orderStatus: {
      type: String,
      default: 'Processing',
    },
    trackingId: { type: String, default: '' },
    courier: { type: String, default: '' },
    trackingUrl: { type: String, default: '' },
    estimatedDelivery: { type: String, default: '' },
    couponApplied: { type: String },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
