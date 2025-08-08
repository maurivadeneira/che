require("dotenv").config();
const mongoose = require("mongoose");

console.log("Intentando conectar a:", process.env.MONGODB_URI);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Conexión exitosa a MongoDB");
  mongoose.connection.close();
})
.catch(err => {
  console.error("❌ Error detallado de conexión:", err);
});
