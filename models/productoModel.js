// models/productoModel.js
const db = require("../config/db");

const ProductoModel = {
  async listar() {
    const [rows] = await db.query(
      `SELECT p.IDProducto, p.Nombre, p.CodigoBarras, 
              p.PrecioCompra, p.PrecioVenta, p.StockActual, p.StockMinimo,
              c.Nombre AS Categoria, v.Nombre AS Proveedor, u.Nombre AS Usuario
       FROM producto p
       JOIN categoria c ON p.IDCategoria = c.IDCategoria
       JOIN proveedor v ON p.IDProveedor = v.IDProveedor
       JOIN usuario u ON p.IDUsuario = u.IDUsuario
       ORDER BY p.Nombre`,
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM producto WHERE IDProducto = ?",
      [id],
    );
    return rows[0] || null;
  },

  async crear(data) {
    const [result] = await db.query(
      `INSERT INTO producto 
       (Nombre, CodigoBarras, IDCategoria, IDProveedor, PrecioCompra, PrecioVenta,
        StockActual, StockMinimo, Imagen, IDUsuario)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.Nombre,
        data.CodigoBarras,
        data.IDCategoria,
        data.IDProveedor,
        data.PrecioCompra,
        data.PrecioVenta,
        data.StockActual,
        data.StockMinimo,
        data.Imagen || null,
        data.IDUsuario,
      ],
    );
    return result.insertId;
  },

  async actualizar(id, data) {
    await db.query(
      `UPDATE producto
       SET Nombre = ?, CodigoBarras = ?, IDCategoria = ?, IDProveedor = ?,
           PrecioCompra = ?, PrecioVenta = ?, StockActual = ?, StockMinimo = ?, Imagen = ?
       WHERE IDProducto = ?`,
      [
        data.Nombre,
        data.CodigoBarras,
        data.IDCategoria,
        data.IDProveedor,
        data.PrecioCompra,
        data.PrecioVenta,
        data.StockActual,
        data.StockMinimo,
        data.Imagen || null,
        id,
      ],
    );
  },

  async eliminar(id) {
    await db.query("DELETE FROM producto WHERE IDProducto = ?", [id]);
  },
};

module.exports = ProductoModel;