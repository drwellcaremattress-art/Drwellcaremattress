import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  addresses: any[];
  wishlist: mongoose.Types.ObjectId[];
  authProvider: string;
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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
