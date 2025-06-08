const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ReminderRepository {
  /**
   * Listar todos los recordatorios de un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} Lista de recordatorios
   */
  async listReminders(userId) {
    try {
      const reminders = await prisma.reminder.findMany({
        where: { userId },
        orderBy: [
          { important: 'desc' }, // Primero los importantes
          { createdAt: 'desc' }   // Luego por fecha de creación
        ],
        select: {
          id: true,
          content: true,
          important: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return reminders;
    } catch (error) {
      console.error('Error al listar recordatorios:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo recordatorio
   * @param {Object} reminderData - Datos del recordatorio
   * @param {string} reminderData.content - Contenido del recordatorio
   * @param {boolean} reminderData.important - Si es importante
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} Recordatorio creado
   */
  async createReminder(reminderData, userId) {
    try {
      const reminder = await prisma.reminder.create({
        data: {
          content: reminderData.content,
          important: reminderData.important || false,
          userId
        },
        select: {
          id: true,
          content: true,
          important: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return reminder;
    } catch (error) {
      console.error('Error al crear recordatorio:', error);
      throw error;
    }
  }

  /**
   * Actualizar parcialmente un recordatorio
   * @param {string} reminderId - ID del recordatorio
   * @param {Object} updateData - Datos a actualizar
   * @param {string} userId - ID del usuario (para verificar permisos)
   * @returns {Promise<Object|null>} Recordatorio actualizado o null si no se encuentra
   */
  async updateReminder(reminderId, updateData, userId) {
    try {
      // Verificar que el recordatorio existe y pertenece al usuario
      const existingReminder = await prisma.reminder.findFirst({
        where: {
          id: reminderId,
          userId
        }
      });

      if (!existingReminder) {
        return null;
      }

      // Actualizar solo los campos proporcionados
      const reminder = await prisma.reminder.update({
        where: { id: reminderId },
        data: updateData,
        select: {
          id: true,
          content: true,
          important: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return reminder;
    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
      throw error;
    }
  }

  /**
   * Eliminar un recordatorio
   * @param {string} reminderId - ID del recordatorio
   * @param {string} userId - ID del usuario (para verificar permisos)
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteReminder(reminderId, userId) {
    try {
      // Verificar que el recordatorio existe y pertenece al usuario
      const existingReminder = await prisma.reminder.findFirst({
        where: {
          id: reminderId,
          userId
        }
      });

      if (!existingReminder) {
        return false;
      }

      // Eliminar recordatorio
      await prisma.reminder.delete({
        where: { id: reminderId }
      });

      return true;
    } catch (error) {
      console.error('Error al eliminar recordatorio:', error);
      throw error;
    }
  }
}

// Instancia singleton del repositorio
const reminderRepository = new ReminderRepository();

module.exports = {
  reminderRepository
};