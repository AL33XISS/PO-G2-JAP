const jwt = require('jsonwebtoken');

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  // Obtener el token del header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  // Si no hay token
  if (!token) {
    return res.status(401).json({ 
      error: 'Acceso denegado. Token no proporcionado.' 
    });
  }

  try {
    // Verificar el token
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next(); // Continuar con la siguiente función
  } catch (error) {
    res.status(403).json({ 
      error: 'Token inválido o expirado' 
    });
  }
};

module.exports = verificarToken;