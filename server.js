// server.js - Servidor principal para Kit2 Herejía Económica

// Importar dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path"); // Añadido para manejar rutas

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

// Servir archivos estáticos desde la carpeta temp
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// Definir rutas
app.use("/api/users", require("./routes/users"));
app.use("/api/kits", require("./routes/kits"));
app.use("/api/invitations", require("./routes/invitations"));
app.use("/api/admin", require("./routes/adminRoutes")); // Añadido para rutas de admin

// Ruta básica
app.get("/api", (req, res) => {
  res.send("API del Sistema Kit2 de Herejía Económica funcionando");
});

// Servir archivos estáticos (para React)
app.use(express.static(path.join(__dirname, 'public')));

// Manejar todas las rutas no API con React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto de escucha
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));