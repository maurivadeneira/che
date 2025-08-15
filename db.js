const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log("=== DEBUG MONGODB CONNECTION ===");
  console.log("MONGODB_URI disponible:", !!process.env.MONGODB_URI);
  console.log("MONGODB_URI length:", process.env.MONGODB_URI ? process.env.MONGODB_URI.length : "undefined");
  console.log("MONGODB_URI primeros 50 chars:", process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + "..." : "NO FOUND");
  console.log("===================================");

  // Determinar qué URI usar
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/herejia_economica';
  
  if (!process.env.MONGODB_URI) {
    console.log("⚠️  MONGODB_URI no definida, usando MongoDB local por defecto");
    console.log("🔧 URI de fallback:", mongoURI);
  } else {
    console.log("✅ Usando MONGODB_URI desde variables de entorno");
  }

  console.log("🔄 Intentando conectar a MongoDB...");
  
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 segundos timeout
      connectTimeoutMS: 10000
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("❌ Error completo:", error);
    
    // Dar pistas sobre posibles soluciones
    if (error.message.includes('ECONNREFUSED')) {
      console.error("💡 Tip: Parece que MongoDB no está corriendo");
      console.error("   - Si usas MongoDB local: Instalar y iniciar MongoDB");
      console.error("   - Si usas MongoDB Atlas: Verificar MONGODB_URI en .env");
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;