# Sistema de Gestión de Proyectos y Tareas

Sistema full-stack desarrollado con **Java Spring Boot** (backend) y **Next.js** (frontend) para la gestión de usuarios, proyectos y tareas con autenticación JWT.

## 🚀 Tecnologías

### Backend
- Java 17
- Spring Boot 3.5.3
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven
- Docker & Docker Compose
- Swagger/OpenAPI

### Frontend
- Next.js 15.4.4
- React 19.1.0
- TypeScript
- Tailwind CSS
- Axios
- Zustand (gestión de estado)

## 📋 Prerrequisitos

- **Docker** y **Docker Compose** instalados
- **Node.js** v18+ y **npm** (para el frontend)
- **Git** (opcional, para clonar el repositorio)

## 🔧 Instalación y Ejecución

### 1. Backend (Spring Boot + PostgreSQL con Docker)

#### Paso 1: Navegar al directorio del backend
```bash
cd backend
```

#### Paso 2: Levantar los servicios con Docker Compose
```bash
docker-compose up -d
```

Este comando iniciará:
- **PostgreSQL** en el puerto `5432`
- **Spring Boot API** en el puerto `8080`


El backend estará disponible en: **http://localhost:8080/kevaluacion/swagger**

#### Verificar que los servicios están corriendo
```bash
docker-compose ps
```

#### Ver logs del backend (opcional)
```bash
docker-compose logs -f backend
```

#### Para detener los servicios
```bash
docker-compose down
```

### 2. Frontend (Next.js)

#### Paso 1: Navegar al directorio del frontend
```bash
cd front
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

#### Paso 3: Ejecutar en modo desarrollo
```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:3000**

## 🔐 Credenciales Preconfiguradas

El sistema viene con usuarios preconfigurados para pruebas:

### Administradores (ADMIN)
| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| CRivas | carlos.rivas@gmail.com | 1234 | ADMIN |
| JGarcía | juan.garcia@gmail.com | 1234 | ADMIN |

### Usuarios Normales (USER)
| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| JMendez | jorge.mendez@yahoo.com | 1234 | USER |
| LTorres | lucia.torres@gmail.com | 1234 | USER |

> **Nota**: Todas las contraseñas están hasheadas en la base de datos con BCrypt. La contraseña real es `1234` para todos los usuarios.

## 📡 Endpoints de la API

### Base URL
```
http://localhost:8080/kevaluacion
```

### Documentación Swagger
```
http://localhost:8080/kevaluacion/swagger
```

## 🗄️ Base de Datos

El sistema se inicializa con:
- **10 usuarios** (2 ADMIN, 8 USER)
- **10 proyectos** de ejemplo
- **10 tareas** distribuidas entre los proyectos

## 🔒 Seguridad

- **JWT Token**: Expira en 1 hora (configurable en `application.properties`)
- **Contraseñas**: Hasheadas con BCrypt
- **CORS**: Configurado para desarrollo local
- **Autorización**: Basada en roles (ADMIN/USER)


