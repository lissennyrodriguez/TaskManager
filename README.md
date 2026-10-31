# TaskManager

Sistema web de gestión y asignación de tareas empresariales desarrollado como proyecto integrador final. Permite administrar usuarios, organizar tareas por departamentos y controlar el seguimiento de las actividades mediante una aplicación web con arquitectura de microservicios.

## 1. Descripción del proyecto

TaskManager es una aplicación diseñada para facilitar la organización y supervisión de las tareas dentro de una empresa.

El sistema permite registrar usuarios, asignar responsabilidades, establecer prioridades, definir fechas límite y consultar el estado de las tareas.

La aplicación organiza los usuarios y las actividades por departamentos:

- Recursos Humanos.
- Tecnología.
- Finanzas.
- Operaciones.

Además, incorpora un sistema de autenticación y autorización basado en JWT, almacenamiento relacional y no relacional, comunicación entre microservicios y una interfaz web desarrollada con React.

## 2. Objetivos del proyecto

- Desarrollar una aplicación web Full Stack.
- Implementar una API REST utilizando Node.js y Express.
- Aplicar los principios de arquitectura MVC y arquitectura hexagonal.
- Implementar una arquitectura de microservicios.
- Integrar SQL Server y MongoDB.
- Implementar autenticación y autorización mediante JWT.
- Gestionar contraseñas de forma segura utilizando bcrypt.
- Incorporar RabbitMQ para la comunicación entre servicios.
- Desarrollar una interfaz web interactiva con React.
- Implementar contenedores mediante Docker.

## 3. Tecnologías utilizadas

| Tecnología | Utilidad |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño y estilos |
| JavaScript | Lógica de programación |
| React | Desarrollo del frontend |
| Node.js | Entorno de ejecución |
| Express.js | Desarrollo de API REST |
| SQL Server | Base de datos relacional |
| MongoDB | Almacenamiento de historial de actividades |
| Mongoose | Modelado de documentos MongoDB |
| JWT | Autenticación y autorización |
| bcrypt | Encriptación de contraseñas |
| Zod | Validación de datos |
| RabbitMQ | Comunicación entre microservicios |
| Docker | Contenerización de servicios |
| Git y GitHub | Control de versiones |

## 4. Arquitectura del sistema

El proyecto utiliza una arquitectura basada en microservicios, con un API Gateway que centraliza las solicitudes del frontend y las dirige al servicio correspondiente.

### Componentes principales

**Frontend**
- Aplicación desarrollada con React.
- Inicio de sesión.
- Panel principal.
- Visualización y gestión de tareas.
- Administración de usuarios según el rol.

**API Gateway**
- Punto de entrada de las solicitudes del frontend.
- Redirección de solicitudes al microservicio correspondiente.
- Centralización del acceso a los servicios.

**Microservicio de autenticación**
- Registro de usuarios.
- Inicio de sesión.
- Validación de credenciales.
- Generación y verificación de tokens JWT.
- Administración de usuarios y roles.

**Microservicio de tareas**
- Creación de tareas.
- Consulta de tareas.
- Actualización de tareas.
- Eliminación de tareas.
- Asignación de tareas a usuarios.

**RabbitMQ**
- Comunicación mediante mensajes entre los microservicios.
- Publicación y consumo de eventos relacionados con los usuarios.

**Bases de datos**
- SQL Server: almacenamiento de usuarios, departamentos y tareas.
- MongoDB: almacenamiento del historial de actividades.

## 5. Roles y permisos

El sistema contempla tres roles principales:

| Funcionalidad | Administrador | Gerente | Empleado |
|---|:---:|:---:|:---:|
| Iniciar sesión | Sí | Sí | Sí |
| Consultar tareas | Sí | Sí | Sí |
| Crear tareas | Sí | Sí | No |
| Editar tareas | Sí | Sí | No |
| Eliminar tareas | Sí | Sí | No |
| Administrar usuarios | Sí | No | No |
| Cambiar roles | Sí | No | No |

Los permisos se controlan de acuerdo con el rol asignado a cada usuario.

## 6. Estructura del proyecto

La organización general del repositorio es la siguiente:

```text
TaskManager/
│
├── api/
│   └── API original
│
├── database/
│   └── Scripts y estructura de SQL Server
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── gateway/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── servicios/
│   ├── auth/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── tareas/
│       ├── src/
│       └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 7. Instalación y configuración

### Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

- Node.js y npm.
- SQL Server.
- MongoDB.
- RabbitMQ.
- Docker Desktop (para ejecutar los contenedores).
- Git.

### Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar en la carpeta:

```bash
cd TaskManager
```

### Instalar dependencias

Instalar las dependencias de cada componente:

```bash
cd gateway
npm install
```

```bash
cd ../servicios/auth
npm install
```

```bash
cd ../tareas
npm install
```

```bash
cd ../../frontend
npm install
```

### Configurar variables de entorno

Cada servicio debe contar con su archivo `.env` y las variables correspondientes a sus conexiones y configuración.

Entre las variables necesarias se encuentran:

```env
PORT=
SQL_SERVER=
SQL_PORT=
SQL_DATABASE=
SQL_USER=
SQL_PASSWORD=
SQL_ENCRYPT=
SQL_TRUST_CERT=

MONGODB_URI=

JWT_SECRET=
JWT_EXPIRES_IN=

RABBITMQ_URL=
```

Los valores deben configurarse de acuerdo con el entorno de ejecución.

**Importante:** No se deben subir archivos `.env`, contraseñas, claves JWT ni credenciales al repositorio público. Utilizar archivos `.env.example` con valores de ejemplo.

## 8. Ejecución del proyecto

Cada componente se ejecuta desde su propia carpeta.

**1. Microservicio de autenticación**

```bash
cd servicios/auth
npm run dev
```

**2. Microservicio de tareas**

```bash
cd servicios/tareas
npm run dev
```

**3. API Gateway**

```bash
cd gateway
npm run dev
```

**4. Frontend**

```bash
cd frontend
npm run dev
```

El frontend se ejecuta normalmente en:

```text
http://localhost:5173
```

El API Gateway se ejecuta normalmente en:

```text
http://localhost:3000
```

Los microservicios utilizan sus respectivos puertos configurados en las variables de entorno.

## 9. Docker

El proyecto incorpora Docker para facilitar la ejecución y administración de los componentes del sistema mediante contenedores.

Para iniciar los servicios definidos en Docker Compose:

```bash
docker compose up -d
```

Para consultar el estado de los contenedores:

```bash
docker compose ps
```

Para consultar los registros:

```bash
docker compose logs
```

Para detener los servicios:

```bash
docker compose down
```

Los datos persistentes se administran mediante volúmenes de Docker.

## 10. Seguridad

El sistema incorpora diferentes mecanismos para proteger la información:

- Autenticación mediante JWT.
- Contraseñas protegidas con bcrypt.
- Validación de datos mediante Zod.
- Rutas protegidas mediante middleware de autenticación.
- Control de permisos según el rol del usuario.
- Variables de entorno para credenciales y configuraciones sensibles.

## 11. Pruebas y verificación

Se pueden verificar los servicios mediante sus rutas de salud:

| Servicio | URL |
|---|---|
| API Gateway | `http://localhost:3000/api/health` |
| Auth Service | `http://localhost:3001/api/health` |
| Tasks Service | `http://localhost:3002/api/health` |

Una respuesta satisfactoria debe indicar que el servicio se encuentra funcionando correctamente.

También se deben comprobar:
- Registro e inicio de sesión.
- Validación de credenciales.
- Acceso a rutas protegidas.
- Creación, consulta, edición y eliminación de tareas.
- Asignación de tareas.
- Permisos de cada rol.
- Comunicación entre microservicios.
- Registro de eventos en MongoDB.
- Funcionamiento de los contenedores Docker.

## 12. Autor

**Desarrollado por:** Lissenny Esther Rodriguez Meran

**Proyecto:** TaskManager

**Tipo:** Proyecto integrador final Full Stack

**Tecnologías principales:** React, Node.js, Express, SQL Server, MongoDB, RabbitMQ y Docker.

---

## 13. Licencia

Este proyecto fue desarrollado con fines académicos y educativos.