const { reminderRepository } = require('../repositories/reminderRepository');

class ReminderController {
  /**
   * GET /api/reminders
   * Obtener todos los recordatorios del usuario autenticado
   */
  async getReminders(req, res) {
    try {
      const userId = req.user.id;

      const reminders = await reminderRepository.listReminders(userId);

      return res.status(200).json(reminders);

    } catch (error) {
      console.error('Error al obtener recordatorios:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * POST /api/reminders
   * Crear un nuevo recordatorio
   */
  async createReminder(req, res) {
    try {
      const userId = req.user.id;
      const reminderData = req.body;

      const reminder = await reminderRepository.createReminder(reminderData, userId);

      return res.status(201).json(reminder);

    } catch (error) {
      console.error('Error al crear recordatorio:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * PATCH /api/reminders/:id
   * Actualizar parcialmente un recordatorio
   */
  async updateReminder(req, res) {
    try {
      const userId = req.user.id;
      const reminderId = req.params.id;
      const updateData = req.body;

      // Filtrar solo campos que no sean undefined/null
      const filteredUpdateData = {};
      if (updateData.content !== undefined) {
        filteredUpdateData.content = updateData.content;
      }
      if (updateData.important !== undefined) {
        filteredUpdateData.important = updateData.important;
      }

      const reminder = await reminderRepository.updateReminder(
        reminderId, 
        filteredUpdateData, 
        userId
      );

      if (!reminder) {
        return res.status(404).json({
          error: 'Recordatorio no encontrado'
        });
      }

      return res.status(200).json(reminder);

    } catch (error) {
      console.error('Error al actualizar recordatorio:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * DELETE /api/reminders/:id
   * Eliminar un recordatorio
   */
  async deleteReminder(req, res) {
    try {
      const userId = req.user.id;
      const reminderId = req.params.id;

      const success = await reminderRepository.deleteReminder(reminderId, userId);

      if (!success) {
        return res.status(404).json({
          error: 'Recordatorio no encontrado'
        });
      }

      return res.status(204).send();

    } catch (error) {
      console.error('Error al eliminar recordatorio:', error);
      return res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }
}

// Instancia singleton del controlador
const reminderController = new ReminderController();

module.exports = {
  reminderController
};