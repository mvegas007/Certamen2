const { userRepository } = require('../repositories/userRepository');

/**
 * Middleware de autenticación
 * Verifica que el token de autorización sea válido
 */
async function authMiddleware(req, res, next) {
  try {
    // Obtener token del header X-Authorization
    const token = req.headers['x-authorization'];

    if (!token) {
      return res.status(401).json({
        error: 'Token de autorización requerido'
      });
    }

    // Buscar usuario por token
    const user = await userRepository.getUserByToken(token);

    if (!user) {
      return res.status(401).json({
        error: 'Token de autorización inválido'
      });
    }

    // Agregar información del usuario a la request
    req.user = user;
    next();

  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

module.exports = {
  authMiddleware
};