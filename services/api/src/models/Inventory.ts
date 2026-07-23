import mongoose, { Schema, Document } from 'mongoose';

export interface IInventory extends Document {
  sku: string;
  warehouseId: string;
  quantity: number;
  reserved: number;
  reorderLevel: number;
}

const InventorySchema: Schema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    warehouseId: { type: String, default: 'default' },
    quantity: { type: Number, required: true, default: 0 },
    reserved: { type: Number, required: true, default: 0 },
    reorderLevel: { type: Number, required: true, default: 5 },
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
