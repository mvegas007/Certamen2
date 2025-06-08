const { userRepository } = require('../repositories/userRepository');

class AuthController {
  /**
   * POST /api/auth/login
   * Autenticar usuario y generar token
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Intentar loguear usuario
      const user = await userRepository.loginUser(username, password);

      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas'
        });
      }

      // Respuesta exitosa con datos del usuario
      return res.status(200).json({
        username: user.username,
        token: user.token,
        name: user.name
      });

    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Cerrar sesión eliminando el token del usuario
   * Requiere middleware de autenticación
   */
  async logout(req, res) {
    try {
      // El token ya fue validado por el middleware de autenticación
      const token = req.headers['x-authorization'];

      // Desloguear usuario
      const success = await userRepository.logoutUser(token);

      if (!success) {
        return res.status(401).json({
          error: 'Token inválido'
        });
      }

      // Respuesta exitosa sin contenido
      return res.status(204).send();

    } catch (error) {
      console.error('Error en logout:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }
}

// Instancia singleton del controlador
const authController = new AuthController();

module.exports = {
  authController
};