import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    if (isConnected && mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    mongoose.set("strictQuery", true);
    mongoose.set("bufferCommands", false); // prevents buffering timeout

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    return conn.connection;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
};

export default dbConnect;
