const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  // Obtener token del header
  const token = req.header("x-auth-token");
  
  console.log('🔑 MIDDLEWARE - Token recibido:', token ? token.substring(0, 20) + '...' : 'NO HAY TOKEN');

  // Verificar si no hay token
  if (!token) {
    console.log('❌ MIDDLEWARE - No hay token');
    return res.status(401).json({ msg: "No hay token, autorización denegada" });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ MIDDLEWARE - Token decodificado:', JSON.stringify(decoded.user, null, 2));
    
    // Agregar usuario al request
    req.user = decoded.user;
    console.log('👤 MIDDLEWARE - req.user.id:', req.user.id);
    next();
  } catch (err) {
    console.log('❌ MIDDLEWARE - Error al verificar token:', err.message);
    res.status(401).json({ msg: "Token no válido" });
  }
};
