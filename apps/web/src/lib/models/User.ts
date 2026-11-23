import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  addresses: any[];
  wishlist: mongoose.Types.ObjectId[];
  authProvider: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
  dealerDetails?: {
    storeName?: string;
    city?: string;
    state?: string;
    gstNumber?: string;
    address?: string;
    status?: string;
  };
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String },
    addresses: [{ type: Schema.Types.Mixed }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'dealer'],
      default: 'user',
    },
    dealerDetails: {
      storeName: { type: String },
      city: { type: String },
      state: { type: String },
      gstNumber: { type: String },
      address: { type: String },
      status: { type: String, default: 'active' },
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = mongoose.model<IUser>('User', UserSchema);
