// controllers/usuarioController.js
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuarioModel");

function validarUsuario(body, esNuevo) {
  const errores = [];

  if (!body.Nombre || !body.Nombre.trim()) {
    errores.push("El nombre es obligatorio.");
  }
  if (!body.Email || !body.Email.trim()) {
    errores.push("El email es obligatorio.");
  }
  if (esNuevo && (!body.Contrasena || body.Contrasena.length < 6)) {
    errores.push("La contraseña debe tener al menos 6 caracteres.");
  }

  return errores;
}

const UsuarioController = {
  async listar(req, res) {
    const usuarios = await Usuario.listar();
    res.json(usuarios);
  },

  async obtener(req, res) {
    const id = Number(req.params.id);
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  },

  async crear(req, res) {
    const errores = validarUsuario(req.body, true);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      const hash = await bcrypt.hash(req.body.Contrasena, 10);
      const nuevoId = await Usuario.crear({
        ...req.body,
        Contrasena: hash,
      });
      const usuario = await Usuario.buscarPorId(nuevoId);
      res.status(201).json(usuario);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ese email ya está registrado."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear el usuario." });
    }
  },

  async actualizar(req, res) {
    const id = Number(req.params.id);
    const existente = await Usuario.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const errores = validarUsuario(req.body, false);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      await Usuario.actualizar(id, req.body);
      const actualizado = await Usuario.buscarPorId(id);
      res.json(actualizado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ese email ya está registrado."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario." });
    }
  },

  async eliminar(req, res) {
    const id = Number(req.params.id);
    const existente = await Usuario.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    try {
      await Usuario.eliminar(id);
      res.json({ mensaje: "Usuario eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el usuario." });
    }
  },

  async login(req, res) {
    const { Email, Contrasena } = req.body;
    if (!Email || !Contrasena) {
      return res
        .status(400)
        .json({ mensaje: "Email y contraseña son obligatorios." });
    }

    const usuario = await Usuario.buscarPorEmail(Email);
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const coincide = await bcrypt.compare(Contrasena, usuario.Contrasena);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    res.json({
      IDUsuario: usuario.IDUsuario,
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      Rol: usuario.Rol,
    });
  },
};

module.exports = UsuarioController;