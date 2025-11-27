# Pixel Planner API - Backend

API REST para gestión de proyectos con autenticación JWT.

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno en `.env`:
```
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
PORT=3000
```

3. Iniciar servidor:
```bash
npm run dev    # Modo desarrollo con nodemon
npm start      # Modo producción
```

## Endpoints de la API

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario
```json
{
  "username": "usuario",
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

#### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```
Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "username": "usuario",
    "email": "usuario@email.com"
  }
}
```

### Proyectos (Requieren JWT)

Todas las rutas requieren header: `Authorization: Bearer TOKEN`

#### GET /api/projects
Obtener todos los proyectos del usuario

#### GET /api/projects/:id
Obtener un proyecto específico

#### POST /api/projects
Crear nuevo proyecto
```json
{
  "title": "Nombre del proyecto",
  "description": "Descripción",
  "status": "todo",
  "priority": "high"
}
```

#### PUT /api/projects/:id
Actualizar proyecto

#### DELETE /api/projects/:id
Eliminar proyecto

### Tareas (Requieren JWT)

#### GET /api/tasks/project/:projectId
Obtener todas las tareas de un proyecto

#### POST /api/tasks/project/:projectId
Crear nueva tarea
```json
{
  "title": "Nombre de la tarea",
  "description": "Descripción",
  "dueDate": "2024-12-31"
}
```

#### PUT /api/tasks/project/:projectId/task/:taskId
Actualizar tarea

#### DELETE /api/tasks/project/:projectId/task/:taskId
Eliminar tarea

### Comentarios (Requieren JWT)

#### GET /api/comments/project/:projectId
Obtener todos los comentarios de un proyecto

#### POST /api/comments/project/:projectId
Crear nuevo comentario
```json
{
  "content": "Contenido del comentario"
}
```

#### DELETE /api/comments/project/:projectId/comment/:commentId
Eliminar comentario

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js       # Configuración MongoDB
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── taskController.js
│   └── commentController.js
├── middlewares/
│   └── authMiddleware.js # Verificación JWT
├── models/
│   ├── User.js
│   ├── Project.js
│   ├── Task.js
│   └── Comment.js
├── routes/
│   ├── authRoutes.js
│   ├── projectRoutes.js
│   ├── taskRoutes.js
│   └── commentRoutes.js
└── index.js              # Servidor principal
```

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt
- CORS
- dotenv
