// models/categoriaModel.js
const db = require("../config/db");

const CategoriaModel = {
  async listar() {
    const [rows] = await db.query(
      "SELECT * FROM categoria ORDER BY Nombre",
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      "SELECT * FROM categoria WHERE IDCategoria = ?",
      [id],
    );
    return rows[0] || null;
  },

  async crear(data) {
    const [result] = await db.query(
      `INSERT INTO categoria (Nombre, Descripcion, Estado)
       VALUES (?, ?, ?)`,
      [data.Nombre, data.Descripcion || null, data.Estado || "Activa"],
    );
    return result.insertId;
  },

  async actualizar(id, data) {
    await db.query(
      `UPDATE categoria
       SET Nombre = ?, Descripcion = ?, Estado = ?
       WHERE IDCategoria = ?`,
      [data.Nombre, data.Descripcion || null, data.Estado || "Activa", id],
    );
  },

  async eliminar(id) {
    await db.query("DELETE FROM categoria WHERE IDCategoria = ?", [id]);
  },
};

module.exports = CategoriaModel;