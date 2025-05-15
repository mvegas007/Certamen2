# TaskMaster Pro

Sistema integral de gestión de tareas y usuarios con API REST.

## Descripción

TaskMaster Pro es una aplicación web moderna diseñada para la gestión eficiente de tareas y recordatorios. El sistema está construido con Node.js y Express, ofreciendo una API REST robusta y segura.

### Componentes Principales

1. **Sistema de Autenticación**
   - Implementa un sistema seguro de login basado en tokens
   - Utiliza hash de contraseñas con salt mediante scrypt
   - Manejo de sesiones mediante tokens de autorización
   - Protección de rutas mediante middleware de autenticación

2. **Gestión de Recordatorios**
   - Creación, lectura, actualización y eliminación (CRUD) de recordatorios
   - Sistema de priorización mediante marcado de recordatorios importantes
   - Ordenamiento automático que prioriza recordatorios importantes
   - Almacenamiento en memoria con estructura de datos optimizada

3. **Validación y Seguridad**
   - Validación robusta de datos mediante Valibot
   - Protección contra inyección de datos maliciosos
   - Validación de longitud y formato de entradas
   - Manejo seguro de tokens de autenticación

4. **API RESTful**
   - Endpoints bien definidos y documentados
   - Respuestas HTTP estandarizadas
   - Manejo de errores consistente
   - Headers de autorización para seguridad

### Características Técnicas

- **Arquitectura**: Aplicación monolítica con separación clara de responsabilidades
- **Base de Datos**: Almacenamiento en memoria (preparado para migración a base de datos persistente)
- **Seguridad**: Implementación de mejores prácticas de seguridad web
- **Rendimiento**: Optimizado para operaciones rápidas y eficientes
- **Escalabilidad**: Diseño modular que permite fácil expansión

### Casos de Uso

1. **Gestión Personal de Tareas**
   - Crear recordatorios para tareas diarias
   - Marcar tareas importantes para priorización
   - Organizar tareas por orden de importancia
   - Eliminar tareas completadas

2. **Autenticación y Seguridad**
   - Login seguro de usuarios
   - Protección de datos personales
   - Manejo seguro de sesiones
   - Validación de permisos

3. **Organización de Tareas**
   - Visualización ordenada de recordatorios
   - Priorización automática de tareas importantes
   - Actualización flexible de recordatorios
   - Eliminación segura de tareas

## Requisitos

- Node.js
- npm o pnpm

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

## Configuración

El servidor se ejecuta por defecto en el puerto 3000. Puedes modificar el puerto estableciendo la variable de entorno `PORT`.

## Uso

Para iniciar el servidor:

```bash
npm start
# o
pnpm start
```

## API Endpoints

### Autenticación

#### POST /api/auth/login
Inicia sesión en el sistema.

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "username": "string",
    "token": "string",
    "name": "string"
}
```

### Recordatorios

#### GET /api/reminders
Obtiene todos los recordatorios ordenados por importancia y fecha.

**Headers:**
- X-Authorization: token

**Response:**
```json
[
    {
        "id": "string",
        "content": "string",
        "createdAt": "number",
        "important": "boolean"
    }
]
```

#### POST /api/reminders
Crea un nuevo recordatorio.

**Headers:**
- X-Authorization: token

**Request Body:**
```json
{
    "content": "string",
    "important": "boolean"
}
```

**Response:**
```json
{
    "id": "string",
    "content": "string",
    "createdAt": "number",
    "important": "boolean"
}
```

#### PATCH /api/reminders/:id
Actualiza un recordatorio existente.

**Headers:**
- X-Authorization: token

**Request Body:**
```json
{
    "content": "string",
    "important": "boolean"
}
```

**Response:**
```json
{
    "id": "string",
    "content": "string",
    "createdAt": "number",
    "important": "boolean"
}
```

#### DELETE /api/reminders/:id
Elimina un recordatorio.

**Headers:**
- X-Authorization: token

**Response:**
- 204 No Content

## Validación de Datos

El sistema utiliza Valibot para la validación de datos:

- Username y password: mínimo 1 carácter
- Contenido del recordatorio: entre 1 y 120 caracteres
- Importante: booleano opcional

## Seguridad

- Autenticación mediante tokens
- Contraseñas hasheadas con salt usando scrypt
- Validación de datos en todas las entradas
- Middleware de autenticación para rutas protegidas

## Estructura del Proyecto

```
.
├── src/
│   ├── routes.js      # Definición de rutas y lógica de negocio
│   ├── schemas.js     # Esquemas de validación
│   ├── middleware.js  # Middleware de autenticación y validación
│   └── utils.js       # Utilidades (hash de contraseñas)
├── public/           # Archivos estáticos
├── index.js         # Punto de entrada de la aplicación
└── package.json     # Dependencias y scripts
```

## Licencia

ISC
