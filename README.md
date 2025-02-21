# API de Gestión de Usuarios y Perfiles

## Descripción
API REST desarrollada con NestJS que proporciona funcionalidades de gestión de usuarios y perfiles, incluyendo autenticación JWT y control de roles.

## Características Principales
- Autenticación con JWT
- Control de roles (ADMIN/USER)
- Gestión de usuarios y perfiles
- Documentación con Swagger
- Tests unitarios
- Dockerización

## Requisitos Previos
- Node.js (v18 o superior)
- npm (v8 o superior)
- Docker (opcional)

## Instalación y Configuración

1. Clonar el repositorio
```bash
git clone https://github.com/MercadoST/GlobalThinkTest.git
cd GlobalThinkTest
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de ambiente
```bash
cp .env.example .env
```

## Ejecución

### Desarrollo Local
```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

### Docker
```bash
# Construir imagen
docker build -t global-think-api .

# Ejecutar contenedor
docker run -p 3000:3000 global-think-api
```

## Pruebas
```bash
# Tests unitarios
npm run test

# Coverage
npm run test:cov
```

## Documentación API
La documentación de la API está disponible a través de Swagger UI:
- Local: http://localhost:3000/docs

### Endpoints Principales

#### Autenticación
- POST /auth/register - Registro de usuarios
- POST /auth/login - Inicio de sesión

#### Usuarios
- GET /users - Listar usuarios
- GET /users/:id - Obtener usuario
- POST /users - Crear usuario
- PATCH /users/:id - Actualizar usuario
- DELETE /users/:id - Eliminar usuario

#### Perfiles
- GET /profile - Listar perfiles
- GET /profile/:id - Obtener perfil
- POST /profile - Crear perfil
- PATCH /profile/:id - Actualizar perfil

## Estructura del Proyecto
```
src/
├── auth/           # Autenticación y autorización
├── user/           # Gestión de usuarios
├── profile/        # Gestión de perfiles
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada
```

## Tecnologías Utilizadas
- NestJS
- TypeScript
- JWT para autenticación
- Jest para testing
- Swagger para documentación
- Docker para contenerización

## Scripts Disponibles
- `npm run start:dev` - Inicia en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm run start:prod` - Inicia en modo producción
- `npm run test` - Ejecuta tests unitarios
- `npm run test:cov` - Genera reporte de cobertura
- `npm run format` - Formatea el código
- `npm run lint` - Ejecuta el linter


## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
