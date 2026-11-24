import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  firmnessPref?: string;
  sleepPosition?: string;
  backPainRelief?: string;
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
  employeeDetails?: {
    department?: string;
    designation?: string;
    employeeCode?: string;
    status?: string;
  };
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dob: { type: String },
    gender: { type: String },
    firmnessPref: { type: String },
    sleepPosition: { type: String },
    backPainRelief: { type: String },
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
      enum: ['user', 'admin', 'dealer', 'employee'],
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
    employeeDetails: {
      department: { type: String },
      designation: { type: String },
      employeeCode: { type: String },
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
