// models/proveedorModel.js
const db = require("../config/db");

const ProveedorModel = {
  async listar() {
    const [rows] = await db.query(
      "SELECT * FROM proveedor ORDER BY Nombre",
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM proveedor WHERE IDProveedor = ?",
      [id],
    );
    return rows[0] || null;
  },

  async crear(data) {
    const [result] = await db.query(
      `INSERT INTO proveedor (Nombre, Contacto, Telefono, Email, Direccion, NIT)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.Nombre,
        data.Contacto || null,
        data.Telefono || null,
        data.Email || null,
        data.Direccion || null,
        data.NIT || null,
      ],
    );
    return result.insertId;
  },

  async actualizar(id, data) {
    await db.query(
      `UPDATE proveedor
       SET Nombre = ?, Contacto = ?, Telefono = ?, Email = ?, Direccion = ?, NIT = ?
       WHERE IDProveedor = ?`,
      [
        data.Nombre,
        data.Contacto || null,
        data.Telefono || null,
        data.Email || null,
        data.Direccion || null,
        data.NIT || null,
        id,
      ],
    );
  },

  async eliminar(id) {
    await db.query("DELETE FROM proveedor WHERE IDProveedor = ?", [id]);
  },
};

module.exports = ProveedorModel;