-- Borrar tablas si existen 
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- Crear tabla de proyectos
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Crear tabla de tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'IN_PROGRESS', 'DONE')) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    assigned_to_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE
);

-- Insertar usuarios 
INSERT INTO users (username, email, password, role) VALUES
  ('CRivas', 'carlos.rivas@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'ADMIN'),
  ('JMendez', 'jorge.mendez@yahoo.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('LTorres', 'lucia.torres@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('PNavarro', 'pedro.navarro@hotmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('ARuiz', 'ana.ruiz@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('MLopez', 'maria.lopez@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('JGarcía', 'juan.garcia@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'ADMIN'),
  ('LFernandez', 'laura.fernandez@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('DRomero', 'diego.romero@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER'),
  ('SHerrera', 'sofia.herrera@gmail.com', '$2a$10$wzB2GSWJskPfuLqt3enZNuD/9cGIMI95yQ2x/AY4QyR1D1j0b4r1i', 'USER');

-- Insertar proyectos
INSERT INTO projects (name, description, created_at, owner_id) VALUES
  ('Sistema de Gestión', 'Plataforma de gestión empresarial', NOW(), 1),
  ('App Salud', 'Aplicación de monitoreo de salud', NOW(), 2),
  ('E-learning Pro', 'Plataforma educativa con cursos online', NOW(), 3),
  ('CRM Clientes', 'Gestión de ventas y clientes', NOW(), 4),
  ('Noticias 360', 'Portal de noticias dinámico', NOW(), 5),
  ('InventarioPlus', 'Sistema para stock de productos', NOW(), 6),
  ('Citas Médicas', 'Gestión de turnos y consultas', NOW(), 7),
  ('WorkTogether', 'Colaboración de equipos remotos', NOW(), 8),
  ('FinanzasYA', 'Dashboard para análisis financiero', NOW(), 9),
  ('InmueblesApp', 'Portal de bienes raíces', NOW(), 10);

-- Insertar tareas
INSERT INTO tasks (title, description, status, due_date, created_at, assigned_to_id, project_id) VALUES
  ('Diseño UI', 'Diseñar interfaz amigable', 'IN_PROGRESS', '2025-08-01', NOW(), 2, 1),
  ('Endpoints Usuarios', 'CRUD de usuarios', 'DONE', '2025-08-02', NOW(), 3, 1),
  ('Login Google', 'OAuth integración', 'PENDING', '2025-08-05', NOW(), 4, 2),
  ('Panel Métricas', 'Dashboard con KPIs', 'IN_PROGRESS', '2025-08-07', NOW(), 5, 3),
  ('PDF Export', 'Generar reportes PDF', 'DONE', '2025-08-08', NOW(), 6, 4),
  ('Unit Tests', 'Crear pruebas Jest', 'PENDING', '2025-08-10', NOW(), 7, 5),
  ('Emails Auto', 'Automatizar notificaciones', 'IN_PROGRESS', '2025-08-12', NOW(), 8, 6),
  ('Carga CSV', 'Importar datos masivos', 'PENDING', '2025-08-15', NOW(), 9, 7),
  ('Responsive UI', 'Optimizar para móviles', 'DONE', '2025-08-18', NOW(), 10, 8),
  ('Despliegue AWS', 'Deploy en la nube', 'PENDING', '2025-08-20', NOW(), 1, 9);
