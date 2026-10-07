// models/ventaModel.js
const db = require("../config/db");

const VentaModel = {
  async listar() {
    const [rows] = await db.query(`
      SELECT v.IDVenta, v.Cantidad, v.PrecioUnitario, v.Total, v.FechaVenta,
             p.Nombre AS Producto, u.Nombre AS Usuario
      FROM venta v
      JOIN producto p ON v.IDProducto = p.IDProducto
      JOIN usuario u ON v.IDUsuario = u.IDUsuario
      ORDER BY v.FechaVenta DESC
    `);
    return rows;
  },

  async crear(data, conexion) {
    const [result] = await conexion.query(
      `INSERT INTO venta (IDProducto, Cantidad, PrecioUnitario, Total, IDUsuario)
       VALUES (?, ?, ?, ?, ?)`,
      [data.IDProducto, data.Cantidad, data.PrecioUnitario, data.Total, data.IDUsuario],
    );
    return result.insertId;
  },

  async resumenHoy() {
    const [rows] = await db.query(`
      SELECT COUNT(*) AS totalVentas, COALESCE(SUM(Total), 0) AS totalIngresos
      FROM venta
      WHERE DATE(FechaVenta) = CURDATE()
    `);
    return rows[0];
  },
};

module.exports = VentaModel;