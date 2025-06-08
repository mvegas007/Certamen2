const { object, string, boolean, optional, minLength, maxLength } = require('valibot');

// Esquema para login
const loginSchema = object({
  username: string([
    minLength(1, 'El username es requerido')
  ]),
  password: string([
    minLength(1, 'La contraseña es requerida')
  ])
});

// Esquema para crear recordatorio
const createReminderSchema = object({
  content: string([
    minLength(1, 'El contenido es requerido'),
    maxLength(120, 'El contenido no puede exceder 120 caracteres')
  ]),
  important: optional(boolean(), false)
});

// Esquema para actualizar recordatorio parcialmente
const updateReminderSchema = object({
  content: optional(string([
    minLength(1, 'El contenido no puede estar vacío'),
    maxLength(120, 'El contenido no puede exceder 120 caracteres')
  ])),
  important: optional(boolean())
});

module.exports = {
  loginSchema,
  createReminderSchema,
  updateReminderSchema
};