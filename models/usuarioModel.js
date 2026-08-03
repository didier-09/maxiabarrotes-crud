// models/usuarioModel.js
const db = require("../config/db");

const UsuarioModel = {
  async listar() {
    const [rows] = await db.query(
      "SELECT IDUsuario, Nombre, Email, Rol, Estado FROM usuario ORDER BY Nombre",
    );
    return rows;
  },

  async buscarPorId(id) {
    const [rows] = await db.query(
      "SELECT IDUsuario, Nombre, Email, Rol, Estado FROM usuario WHERE IDUsuario = ?",
      [id],
    );
    return rows[0] || null;
  },

  async buscarPorEmail(email) {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE Email = ?",
      [email],
    );
    return rows[0] || null;
  },

  async crear(data) {
    const [result] = await db.query(
      `INSERT INTO usuario (Nombre, Email, Contrasena, Rol, Estado)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.Nombre,
        data.Email,
        data.Contrasena,
        data.Rol || "Empleado",
        data.Estado || "Activo",
      ],
    );
    return result.insertId;
  },

  async actualizar(id, data) {
    await db.query(
      `UPDATE usuario
       SET Nombre = ?, Email = ?, Rol = ?, Estado = ?
       WHERE IDUsuario = ?`,
      [data.Nombre, data.Email, data.Rol, data.Estado, id],
    );
  },

  async eliminar(id) {
    await db.query("DELETE FROM usuario WHERE IDUsuario = ?", [id]);
  },
};

module.exports = UsuarioModel;