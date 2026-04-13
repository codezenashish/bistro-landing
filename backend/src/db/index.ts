import mongoose from "mongoose";
import { DB_NAME } from "../constants.ts";

const connectDB = async () => {
  try {
    const baseMongoUri = process.env.MONGO_URI?.replace(/\/+$/, "");

    if (!baseMongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const mongoUri = `${baseMongoUri}/${DB_NAME}`;
    const connectionInstance = await mongoose.connect(mongoUri);

    console.log(
      `\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
