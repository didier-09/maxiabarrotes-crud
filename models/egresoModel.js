// models/egresoModel.js
const db = require("../config/db");

const EgresoModel = {
  async listar() {
    const [rows] = await db.query(`
      SELECT e.IDEgreso, e.Concepto, e.Categoria, e.Monto, e.FechaEgreso, u.Nombre AS Usuario
      FROM egreso e
      JOIN usuario u ON e.IDUsuario = u.IDUsuario
      ORDER BY e.FechaEgreso DESC
    `);
    return rows;
  },

  async crear(data) {
    const [result] = await db.query(
      `INSERT INTO egreso (Concepto, Categoria, Monto, IDUsuario)
       VALUES (?, ?, ?, ?)`,
      [data.Concepto, data.Categoria || "Otro", data.Monto, data.IDUsuario],
    );
    return result.insertId;
  },

  async eliminar(id) {
    await db.query("DELETE FROM egreso WHERE IDEgreso = ?", [id]);
  },

  async resumenMes() {
    const [rows] = await db.query(`
      SELECT COALESCE(SUM(Monto), 0) AS totalEgresos
      FROM egreso
      WHERE MONTH(FechaEgreso) = MONTH(CURDATE()) AND YEAR(FechaEgreso) = YEAR(CURDATE())
    `);
    return rows[0];
  },
};

module.exports = EgresoModel;