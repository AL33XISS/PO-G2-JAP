-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS tienda_online;
USE tienda_online;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255),
    telefono VARCHAR(50),
    edad INT,
    genero VARCHAR(50),
    direccion TEXT,
    codigo_postal VARCHAR(20),
    foto TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255),
    cantidad_productos INT DEFAULT 0
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'USD',
    imagen_principal VARCHAR(255),
    vendidos INT DEFAULT 0,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabla de imágenes de productos
CREATE TABLE IF NOT EXISTS imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    producto_id INT,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de carrito
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de comentarios
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Datos de ejemplo en usuarios
INSERT INTO usuarios (email, password, nombre) VALUES
('sebastiansilvayferrer@JAP', 'jap314', 'Sebastián Silva'),
('agustinfourcade@JAP', 'jap314', 'Agustín Fourcade'),
('alexissarsamendi@JAP', 'jap314', 'Alexis Sarsamendi');

-- Insertar datos de ejemplo en categorías
INSERT INTO categorias (id, nombre, descripcion, imagen, cantidad_productos) VALUES
(101, 'Autos', 'Los mejores precios en autos 0 kilómetro', 'img/cars_index.jpg', 15),
(102, 'Juguetes', 'Encuentra aquí los mejores precios para niños/as', 'img/toys_index.jpg', 7),
(103, 'Muebles', 'Muebles antiguos, nuevos y para armar', 'img/furniture_index.jpg', 10),
(104, 'Herramientas', 'Herramientas para todo tipo de trabajo', 'img/tools_index.jpg', 5);