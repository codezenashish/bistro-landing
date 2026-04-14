import mongoose, { Schema, Document } from "mongoose";

export interface IMenu extends Document {
  name: string;
  description: string;
  price: number;
  category: "Starter" | "Main Course" | "Dessert" | "Beverage";
  image: string; // Cloudinary URL
  isAvailable: boolean;
  isVeg: boolean;
}

const menuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ["Starter", "Main Course", "Dessert", "Beverage"], 
      required: true 
    },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Menu = mongoose.model<IMenu>("Menu", menuSchema);