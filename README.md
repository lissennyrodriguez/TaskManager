# TaskManager

**Sistema de gestión de tareas Full Stack** desarrollado con React, Node.js, Express, SQL Server y MongoDB.

TaskManager permite organizar tareas, gestionar usuarios y departamentos, asignar responsables y controlar el acceso según el rol. Utiliza **SQL Server** para los datos operativos y **MongoDB** para registrar eventos de actividad.

> **Estado:** proyecto en desarrollo. La autenticación, las operaciones principales de tareas y la administración de usuarios se han probado parcialmente. Algunas funcionalidades y permisos requieren validación integral antes de considerarse terminados.

## Contenido

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura y estructura](#arquitectura-y-estructura)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [API REST](#api-rest)
- [Roles y permisos](#roles-y-permisos)
- [Persistencia y auditoría](#persistencia-y-auditoría)
- [Pruebas](#pruebas)
- [Estado y próximos pasos](#estado-y-próximos-pasos)
- [Seguridad](#seguridad)

## Características

- Registro e inicio de sesión mediante **JWT** y contraseñas protegidas con **bcrypt**.
- Tres roles: administrador (`admin`), gerente (`manager`) y empleado (`employee`).
- Operaciones CRUD de tareas: crear, consultar, actualizar y eliminar.
- Asignación de tareas a usuarios registrados, con selección de responsable y departamento.
- Prioridades: `baja`, `media`, `alta` y `urgente`.
- Estados: `pendiente`, `en_progreso`, `completada` y `cancelada`.
- Fecha límite opcional.
- Panel de tareas y sección de administración de usuarios.
- Validaciones de entrada con **Zod** en el backend.
- Registro de eventos del sistema con **Mongoose** en MongoDB.

**En validación:** asignaciones entre departamentos y entre diferentes roles, permisos de edición y registro de cambios de rol en MongoDB. El diseño y los mensajes de confirmación de la interfaz continúan en mejora.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS, Bootstrap 5 |
| Backend | Node.js, Express, CommonJS |
| Autenticación y seguridad | JWT, bcrypt, Zod, CORS |
| Datos principales | Microsoft SQL Server |
| Auditoría | MongoDB, Mongoose |
| Herramientas | VS Code, SSMS, PowerShell, npm, Git y GitHub |

## Arquitectura y estructura

El frontend React consume una API REST. El backend separa rutas, controladores, lógica de aplicación, modelos y repositorios. SQL Server almacena usuarios, departamentos y tareas; MongoDB almacena registros de actividad.

```text
TaskManager/
├── api/
│   ├── src/
│   │   ├── application/
│   │   │   └── tasks/task.use-cases.js
│   │   ├── config/env.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   ├── domain/tasks/task.entity.js
│   │   ├── infrastructure/
│   │   │   ├── database/
│   │   │   │   ├── sqlserver.js
│   │   │   │   └── mongodb.js
│   │   │   └── repositories/
│   │   │       ├── auth.repository.js
│   │   │       └── task.repository.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/Activity.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── task.routes.js
│   │   │   └── user.routes.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── task.validator.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env                 # Configuración local; no publicar
│   └── package.json
├── database/
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskEditForm.jsx
│   │   ├── pages/Dashboard.jsx
│   │   ├── services/
│   │   │   ├── task.service.js
│   │   │   └── user.service.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

> Estructura de referencia basada en los archivos trabajados. Puede haber componentes adicionales de autenticación, estilos u otros archivos en la copia local.

## Requisitos

- Node.js y npm.
- Microsoft SQL Server en ejecución y acceso mediante SSMS u otra herramienta SQL.
- Una instancia accesible de MongoDB (local o Atlas).
- Git (opcional, para clonar y versionar el repositorio).

## Instalación

### 1. Obtener el proyecto

```bash
git clone <URL_DEL_REPOSITORIO>
cd TaskManager
```

Si ya tienes la carpeta del proyecto, ábrela directamente; no necesitas volver a clonarla.

### 2. Preparar SQL Server

1. Inicia SQL Server y conéctate mediante SSMS.
2. Ejecuta `database/schema.sql` para preparar `TaskManagerDB` y las tablas `Departments`, `Users` y `Tasks`.
3. Comprueba que la instancia acepte conexiones en el puerto configurado (por ejemplo, `1433`).
4. Verifica que existan los departamentos necesarios antes de registrar usuarios.

Durante el desarrollo se utilizaron Recursos Humanos, Tecnología, Finanzas y Operaciones.

### 3. Instalar y configurar el backend

Desde la carpeta raíz:

```bash
cd api
npm install
```

Configura `api/.env` con valores propios. **El siguiente bloque contiene marcadores de ejemplo, no credenciales reales:**

```dotenv
PORT=3000
FRONTEND_URL=http://localhost:5173

SQL_SERVER=localhost
SQL_PORT=1433
SQL_DATABASE=TaskManagerDB
SQL_USER=sa
SQL_PASSWORD=REEMPLAZAR_CON_PASSWORD_LOCAL
SQL_ENCRYPT=false
SQL_TRUST_CERT=true

MONGODB_URI=mongodb://127.0.0.1:27017/TaskManagerDB
JWT_SECRET=REEMPLAZAR_CON_SECRETO_LARGO_Y_ALEATORIO
```

Si utilizas MongoDB Atlas, reemplaza `MONGODB_URI` por tu cadena de conexión privada. Comprueba los nombres exactos de las variables en `api/src/config/env.js`.

Inicia el servidor:

```bash
npm run dev
```

La API utiliza por defecto `http://localhost:3000`. Para verificarla, abre `http://localhost:3000/api/health`.

### 4. Instalar y ejecutar el frontend

En **otra terminal**, desde la carpeta raíz:

```bash
cd frontend
npm install
npm run dev
```

Abre la dirección indicada por Vite, normalmente `http://localhost:5173`.

> El backend y el frontend deben permanecer en ejecución al mismo tiempo. Si Bootstrap no está instalado, utiliza `npm install bootstrap` dentro de `frontend` y revisa su importación en `src/main.jsx`.

## API REST

### Autenticación

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Registrar usuario |
| `POST` | `/api/auth/login` | Iniciar sesión y obtener JWT |
| `GET` | `/api/auth/me` | Consultar sesión autenticada |
| `GET` | `/api/health` | Comprobar disponibilidad de la API |

### Tareas

| Método | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/tasks` | Listar tareas visibles |
| `GET` | `/api/tasks/:id` | Consultar tarea |
| `POST` | `/api/tasks` | Crear tarea |
| `PUT` | `/api/tasks/:id` | Actualizar tarea |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea |

### Usuarios

| Método | Ruta | Uso |
| --- | --- | --- |
| `GET` | `/api/users` | Listar usuarios (administrador) |
| `GET` | `/api/users/assignable` | Consultar usuarios asignables (administrador o gerente) |
| `PATCH` | `/api/users/:id/role` | Cambiar rol (administrador) |

Las rutas privadas requieren el encabezado:

```http
Authorization: Bearer TU_TOKEN_JWT
```

### Ejemplo: crear una tarea

```http
POST /api/tasks
Authorization: Bearer TU_TOKEN_JWT
Content-Type: application/json
```

```json
{
  "title": "Preparar informe mensual",
  "description": "Consolidar los resultados del equipo",
  "departmentId": 2,
  "assignedTo": 1,
  "priority": "alta",
  "status": "pendiente",
  "dueDate": "2026-11-15"
}
```

`departmentId` y `assignedTo` deben referirse a registros existentes. La validación de asignaciones entre departamentos debe comprobarse tanto en la interfaz como en la API.

## Roles y permisos

La siguiente tabla expresa las **reglas previstas** del proyecto. Es necesario validar cada operación desde el backend antes de dar la matriz por completamente implementada.

| Operación | Administrador | Gerente | Empleado |
| --- | :---: | :---: | :---: |
| Iniciar sesión | Sí | Sí | Sí |
| Consultar tareas autorizadas | Sí | Sí | Sí |
| Crear y asignar tareas | Sí | Sí | No |
| Asignar a usuarios de otros departamentos | Previsto | Previsto | No |
| Editar y eliminar tareas | Según permisos | Según permisos | Limitado |
| Cambiar roles de usuarios | Sí | No | No |
| Recibir tareas | Sí | Sí | Sí |

La autorización debe aplicarse en el servidor; ocultar un botón en React no sustituye la comprobación de permisos.

## Persistencia y auditoría

### SQL Server

- `Departments`: catálogo de departamentos.
- `Users`: usuarios, roles y departamento asociado.
- `Tasks`: título, descripción, responsable, departamento, prioridad, estado y fechas.

### MongoDB

El modelo `Activity` incluye `action`, `entityType`, `entityId`, `userId`, `details` y `createdAt`, con índices por entidad y fecha.

Acciones contempladas por el modelo:

```text
TASK_CREATED
TASK_UPDATED
TASK_STATUS_UPDATED
TASK_DELETED
USER_REGISTERED
USER_LOGIN
USER_ROLE_CHANGED
```

**Observación:** se verificó la escritura de otras actividades, pero el evento `USER_ROLE_CHANGED` todavía está pendiente de confirmación en MongoDB, aunque el cambio de rol mediante la API sí funcionó.

Para consultar los últimos eventos desde `mongosh`:

```javascript
use TaskManagerDB
db.activities.find().sort({ createdAt: -1 }).limit(10)
```

## Pruebas

Lista de comprobación manual:

- [x] Iniciar la API y obtener una respuesta correcta de `/api/health`.
- [x] Autenticarse y consultar `/api/users` con un JWT válido.
- [x] Comprobar que `/api/users` rechaza solicitudes sin token (`401`).
- [x] Cambiar un rol mediante `PATCH /api/users/:id/role` desde PowerShell.
- [x] Consultar actividades existentes en MongoDB.
- [ ] Confirmar que `USER_ROLE_CHANGED` se registra después de cambiar un rol.
- [ ] Corregir o validar el cambio de roles desde el panel React.
- [ ] Validar las asignaciones entre departamentos y entre roles.
- [ ] Completar las pruebas de creación, edición, eliminación y actualización de estado de tareas desde la interfaz.
- [ ] Comprobar mensajes de éxito, errores y confirmaciones en todos los formularios.
- [ ] Añadir pruebas automatizadas de API y frontend.

## Estado y próximos pasos

1. **Auditoría de roles:** confirmar la escritura de `USER_ROLE_CHANGED` en MongoDB y revisar cualquier error en la terminal del backend.
2. **Administración de usuarios:** validar el flujo de cambio de rol desde el frontend, incluido el manejo de errores y la sesión JWT.
3. **Asignación de tareas:** verificar que administradores y gerentes puedan asignar tareas a usuarios de cualquier departamento, de acuerdo con las reglas del proyecto.
4. **Experiencia de usuario:** mejorar la presentación de los formularios de inicio de sesión y registro, manteniendo los colores existentes, y mostrar confirmaciones claras.
5. **Calidad y despliegue:** agregar filtros, pruebas automatizadas, documentación de errores y opciones de despliegue.

## Seguridad

- Nunca publiques archivos `.env`, contraseñas, cadenas de conexión o tokens JWT.
- Usa un `JWT_SECRET` robusto y diferente en cada entorno.
- Valida las entradas con Zod y aplica autorización por rol en las rutas.
- No confíes exclusivamente en validaciones del navegador.
- Excluye dependencias y archivos locales del repositorio. Ejemplo de `.gitignore`:

```gitignore
**/node_modules/
**/.env
**/.env.*
!**/.env.example
**/dist/
*.log
```

## Autoría

Proyecto académico y de portafolio de desarrollo **Full Stack**.

---

**TaskManager** · React · Node.js · Express · SQL Server · MongoDB
