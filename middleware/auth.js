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
    console.log('✅ MIDDLEWARE - Token decodificado COMPLETO:', JSON.stringify(decoded, null, 2));
    
    // COMPATIBILIDAD: Manejar ambos formatos de token
    let user;
    if (decoded.user) {
      // Formato nuevo: { user: { id: "...", name: "...", ... } }
      user = decoded.user;
      console.log('🔍 MIDDLEWARE - Usando formato NUEVO: decoded.user');
    } else if (decoded.userId) {
      // Formato viejo: { userId: "..." }
      user = { id: decoded.userId };
      console.log('🔍 MIDDLEWARE - Usando formato VIEJO: decoded.userId');
    } else {
      console.log('❌ MIDDLEWARE - Token no tiene ni user ni userId');
      return res.status(401).json({ msg: "Token no válido" });
    }
    
    // Agregar usuario al request
    req.user = user;
    console.log('👤 MIDDLEWARE - req.user.id final:', req.user.id);
    
    if (!req.user || !req.user.id) {
      console.log('❌ MIDDLEWARE - req.user o req.user.id son undefined');
      return res.status(401).json({ msg: "Token no válido" });
    }
    
    next();
  } catch (err) {
    console.log('❌ MIDDLEWARE - Error al verificar token:', err.message);
    res.status(401).json({ msg: "Token no válido" });
  }
};
