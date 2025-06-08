const { PrismaClient } = require('@prisma/client');
const { verifyPassword, generateToken } = require('../utils/auth');

const prisma = new PrismaClient();

class UserRepository {
  /**
   * Obtener un usuario por token de autenticación
   * @param {string} token - Token de autenticación
   * @returns {Promise<Object|null>} Usuario o null si no se encuentra
   */
  async getUserByToken(token) {
    try {
      const user = await prisma.user.findFirst({
        where: { token },
        select: {
          id: true,
          username: true,
          name: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return user;
    } catch (error) {
      console.error('Error al obtener usuario por token:', error);
      throw error;
    }
  }

  /**
   * Loguear usuario verificando username y password
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object|null>} Datos del usuario logueado o null si las credenciales son incorrectas
   */
  async loginUser(username, password) {
    try {
      // Buscar usuario por username
      const user = await prisma.user.findUnique({
        where: { username }
      });

      if (!user) {
        return null;
      }

      // Verificar contraseña
      const isPasswordValid = await verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return null;
      }

      // Generar nuevo token
      const token = generateToken();

      // Actualizar token en base de datos
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { token },
        select: {
          id: true,
          username: true,
          name: true,
          token: true
        }
      });

      return updatedUser;
    } catch (error) {
      console.error('Error al loguear usuario:', error);
      throw error;
    }
  }

  /**
   * Desloguear usuario eliminando el token
   * @param {string} token - Token de autenticación
   * @returns {Promise<boolean>} True si se deslogueó correctamente
   */
  async logoutUser(token) {
    try {
      // Buscar usuario por token
      const user = await prisma.user.findFirst({
        where: { token }
      });

      if (!user) {
        return false;
      }

      // Eliminar token (establecer como null)
      await prisma.user.update({
        where: { id: user.id },
        data: { token: null }
      });

      return true;
    } catch (error) {
      console.error('Error al desloguear usuario:', error);
      throw error;
    }
  }
}

// Instancia singleton del repositorio
const userRepository = new UserRepository();

module.exports = {
  userRepository
};