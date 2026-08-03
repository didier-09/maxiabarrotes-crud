CREATE DATABASE IF NOT EXISTS maxiabarrotes;
USE maxiabarrotes;

-- Tablas de apoyo mínimas (usuario, categoria, proveedor)
CREATE TABLE usuario (
  IDUsuario INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(150) NOT NULL,
  Email VARCHAR(100) NOT NULL UNIQUE,
  Contrasena VARCHAR(255) NOT NULL,
  Rol ENUM('Administrador','Empleado') NOT NULL,
  Estado ENUM('Activo','Inactivo') DEFAULT 'Activo'
);

CREATE TABLE categoria (
  IDCategoria INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(100) NOT NULL UNIQUE,
  Descripcion TEXT,
  Estado ENUM('Activa','Inactiva') DEFAULT 'Activa'
);

CREATE TABLE proveedor (
  IDProveedor INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(150) NOT NULL,
  Contacto VARCHAR(100),
  Telefono VARCHAR(20),
  Email VARCHAR(100),
  Direccion TEXT,
  NIT VARCHAR(20) UNIQUE
);

-- Tabla PRODUCTO según el modelo lógico
CREATE TABLE producto (
  IDProducto INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(150) NOT NULL,
  CodigoBarras VARCHAR(50) UNIQUE,
  IDCategoria INT NOT NULL,
  IDProveedor INT NOT NULL,
  PrecioCompra DECIMAL(10,2) NOT NULL CHECK (PrecioCompra >= 0),
  PrecioVenta DECIMAL(10,2) NOT NULL CHECK (PrecioVenta >= PrecioCompra),
  StockActual INT NOT NULL DEFAULT 0 CHECK (StockActual >= 0),
  StockMinimo INT NOT NULL DEFAULT 10 CHECK (StockMinimo >= 0),
  Imagen VARCHAR(255),
  IDUsuario INT NOT NULL,
  FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_producto_categoria
    FOREIGN KEY (IDCategoria) REFERENCES categoria(IDCategoria),
  CONSTRAINT fk_producto_proveedor
    FOREIGN KEY (IDProveedor) REFERENCES proveedor(IDProveedor),
  CONSTRAINT fk_producto_usuario
    FOREIGN KEY (IDUsuario) REFERENCES usuario(IDUsuario)
);