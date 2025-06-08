const express = require('express');
const { authController } = require('./controllers/authController');
const { reminderController } = require('./controllers/reminderController');
const { authMiddleware } = require('./middlewares/auth');
const { createValidationMiddleware } = require('./middlewares/validation.middleware');
const { 
  loginSchema, 
  createReminderSchema, 
  updateReminderSchema 
} = require('./schemas/validation');

const router = express.Router();

// =============================================================================
// RUTAS DE AUTENTICACIÓN
// =============================================================================

/**
 * POST /api/auth/login
 * Autenticar usuario
 */
router.post(
  '/auth/login',
  createValidationMiddleware(loginSchema),
  authController.login
);

/**
 * POST /api/auth/logout
 * Cerrar sesión (requiere autenticación)
 */
router.post(
  '/auth/logout',
  authMiddleware,
  authController.logout
);

// =============================================================================
// RUTAS DE RECORDATORIOS (todas requieren autenticación)
// =============================================================================

/**
 * GET /api/reminders
 * Obtener todos los recordatorios del usuario
 */
router.get(
  '/reminders',
  authMiddleware,
  reminderController.getReminders
);

/**
 * POST /api/reminders
 * Crear un nuevo recordatorio
 */
router.post(
  '/reminders',
  authMiddleware,
  createValidationMiddleware(createReminderSchema),
  reminderController.createReminder
);

/**
 * PATCH /api/reminders/:id
 * Actualizar parcialmente un recordatorio
 */
router.patch(
  '/reminders/:id',
  authMiddleware,
  createValidationMiddleware(updateReminderSchema),
  reminderController.updateReminder
);

/**
 * DELETE /api/reminders/:id
 * Eliminar un recordatorio
 */
router.delete(
  '/reminders/:id',
  authMiddleware,
  reminderController.deleteReminder
);

module.exports = router;