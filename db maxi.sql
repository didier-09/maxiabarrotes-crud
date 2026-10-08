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

CREATE TABLE venta (
  IDVenta INT PRIMARY KEY AUTO_INCREMENT,
  IDProducto INT NOT NULL,
  Cantidad INT NOT NULL CHECK (Cantidad > 0),
  PrecioUnitario DECIMAL(10,2) NOT NULL CHECK (PrecioUnitario >= 0),
  Total DECIMAL(10,2) NOT NULL CHECK (Total >= 0),
  IDUsuario INT NOT NULL,
  FechaVenta DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_venta_producto FOREIGN KEY (IDProducto) REFERENCES producto(IDProducto),
  CONSTRAINT fk_venta_usuario FOREIGN KEY (IDUsuario) REFERENCES usuario(IDUsuario)
);

CREATE TABLE egreso (
  IDEgreso INT PRIMARY KEY AUTO_INCREMENT,
  Concepto VARCHAR(150) NOT NULL,
  Categoria ENUM('Proveedor','Servicios','Arriendo','Nomina','Otro') NOT NULL DEFAULT 'Otro',
  Monto DECIMAL(10,2) NOT NULL CHECK (Monto > 0),
  IDUsuario INT NOT NULL,
  FechaEgreso DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_egreso_usuario FOREIGN KEY (IDUsuario) REFERENCES usuario(IDUsuario)
);

CREATE TABLE factura (
  IDFactura INT PRIMARY KEY AUTO_INCREMENT,
  Total DECIMAL(10,2) NOT NULL DEFAULT 0,
  IDUsuario INT NOT NULL,
  FechaFactura DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_factura_usuario FOREIGN KEY (IDUsuario) REFERENCES usuario(IDUsuario)
);

ALTER TABLE venta
  ADD COLUMN IDFactura INT NULL,
  ADD CONSTRAINT fk_venta_factura FOREIGN KEY (IDFactura) REFERENCES factura(IDFactura);

ALTER TABLE usuario
MODIFY COLUMN Rol ENUM('Administrador','Empleado','Contador') NOT NULL;

INSERT INTO usuario (Nombre, Email, Contrasena, Rol, Estado) VALUES
('Empleado Prueba', 'empleado@maxiabarrotes.com', '$2b$10$CKA71xUnQrkxpqOLxLV0/em4JcFjmBFhFbT1/PVRSplqwNFAhvNWW', 'Empleado', 'Activo'),
('Contador Prueba', 'contador@maxiabarrotes.com', '$2b$10$CKA71xUnQrkxpqOLxLV0/em4JcFjmBFhFbT1/PVRSplqwNFAhvNWW', 'Contador', 'Activo');