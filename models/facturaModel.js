// models/facturaModel.js
const db = require("../config/db");

const FacturaModel = {
  async crear(IDUsuario, conexion) {
    const [result] = await conexion.query(
      "INSERT INTO factura (IDUsuario) VALUES (?)",
      [IDUsuario],
    );
    return result.insertId;
  },

  async actualizarTotal(id, total, conexion) {
    await conexion.query(
      "UPDATE factura SET Total = ? WHERE IDFactura = ?",
      [total, id],
    );
  },

  async obtenerConDetalle(id) {
    const [facturas] = await db.query(
      `SELECT f.IDFactura, f.Total, f.FechaFactura, u.Nombre AS Vendedor
       FROM factura f JOIN usuario u ON f.IDUsuario = u.IDUsuario
       WHERE f.IDFactura = ?`,
      [id],
    );
    if (!facturas[0]) return null;

    const [lineas] = await db.query(
      `SELECT v.Cantidad, v.PrecioUnitario, v.Total, p.Nombre AS Producto, p.CodigoBarras
       FROM venta v JOIN producto p ON v.IDProducto = p.IDProducto
       WHERE v.IDFactura = ?`,
      [id],
    );

    return { ...facturas[0], lineas };
  },

  async listar() {
    const [rows] = await db.query(`
      SELECT f.IDFactura, f.Total, f.FechaFactura, u.Nombre AS Vendedor
      FROM factura f
      JOIN usuario u ON f.IDUsuario = u.IDUsuario
      ORDER BY f.FechaFactura DESC
    `);
    return rows;
  },

};

module.exports = FacturaModel;