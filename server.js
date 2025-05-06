// server.js - Servidor principal para Kit2 Heresy
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Importar la configuración de la base de datos
const connectDB = require("./db");

// Configurar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Definir rutas
app.use("/api/users", require("./routes/users"));

// Ruta básica
app.get("/", (req, res) => {
  res.send("API del Sistema Kit2 de Herejía Económica funcionando");
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
