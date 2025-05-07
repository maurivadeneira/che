const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar modelo de usuario
const User = require('./models/User');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/herejia_economica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB conectada');
  
  try {
    // Verificar si ya existe un administrador
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (adminExists) {
      console.log('Ya existe un administrador en el sistema');
    } else {
      // Crear administrador con credenciales específicas
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('HerejiaAdmin2024!', salt);
      
      const newAdmin = new User({
        name: 'Administrador CHE',
        username: 'admin',
        email: 'admin@corpherejiaeconomica.com',
        password: hashedPassword,
        isAdmin: true,
        createdAt: new Date()
      });
      
      await newAdmin.save();
      console.log('Administrador creado exitosamente');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Cerrar conexión
    mongoose.disconnect();
    console.log('Conexión cerrada');
  }
})
.catch(err => {
  console.error('Error de conexión a MongoDB:', err);
});