const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log("=== DEBUG MONGODB CONNECTION ===");
  console.log("MONGODB_URI disponible:", !!process.env.MONGODB_URI);
  console.log("MONGODB_URI length:", process.env.MONGODB_URI ? process.env.MONGODB_URI.length : "undefined");
  console.log("MONGODB_URI primeros 50 chars:", process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + "..." : "NO FOUND");
  console.log("===================================");

  if (!process.env.MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI no está definida");
    process.exit(1);
  }

  console.log("🔄 Intentando conectar a MongoDB...");
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
      connectTimeoutMS: 10000
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("❌ Error completo:", error);
    process.exit(1);
  }
};

module.exports = connectDB;