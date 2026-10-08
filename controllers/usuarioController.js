// controllers/usuarioController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarioModel");

const ROLES_VALIDOS = ["Administrador", "Empleado", "Contador"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Estado con el que nacen las cuentas creadas desde el registro público.
// Si lo cambias a "Inactivo", un administrador tendría que activar cada cuenta.
const ESTADO_REGISTRO = "Activo";

// Hash de relleno: se compara cuando el correo no existe, para que la
// respuesta tarde igual y nadie pueda descubrir qué correos están registrados
const HASH_RELLENO =
  "$2b$10$CKA71xUnQrkxpqOLxLV0/em4JcFjmBFhFbT1/PVRSplqwNFAhvNWW";

function validarUsuario(body, esNuevo) {
  const errores = [];

  if (typeof body.Nombre !== "string" || !body.Nombre.trim()) {
    errores.push("El nombre es obligatorio.");
  }
  if (typeof body.Email !== "string" || !EMAIL_REGEX.test(body.Email)) {
    errores.push("El email no es válido.");
  }
  if (esNuevo) {
    if (typeof body.Contrasena !== "string" || body.Contrasena.length < 8) {
      errores.push("La contraseña debe tener al menos 8 caracteres.");
    } else if (body.Contrasena.length > 72) {
      errores.push("La contraseña no puede superar 72 caracteres.");
    }
  }
  if (body.Rol && !ROLES_VALIDOS.includes(body.Rol)) {
    errores.push("El rol no es válido.");
  }

  return errores;
}

const opcionesCookie = {
  httpOnly: true, // JavaScript del navegador no puede leer la cookie
  sameSite: "strict", // el navegador no la envía desde otros sitios
  secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
};

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

  // Solo administrador: puede crear cuentas con cualquier rol
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

  // Público: siempre crea un Empleado, sin importar lo que mande el navegador
  async registro(req, res) {
    const errores = validarUsuario(req.body, true);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      const hash = await bcrypt.hash(req.body.Contrasena, 10);
      await Usuario.crear({
        Nombre: req.body.Nombre.trim(),
        Email: req.body.Email.trim(),
        Contrasena: hash,
        Rol: "Empleado",
        Estado: ESTADO_REGISTRO,
      });
      res.status(201).json({ mensaje: "Usuario creado correctamente." });
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

    if (id === req.usuario.IDUsuario) {
      return res
        .status(400)
        .json({ mensaje: "No puedes eliminar tu propia cuenta." });
    }

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

    const emailValido = typeof Email === "string" && EMAIL_REGEX.test(Email);
    const contrasenaValida =
      typeof Contrasena === "string" &&
      Contrasena.length >= 6 &&
      Contrasena.length <= 72;

    if (!emailValido || !contrasenaValida) {
      return res
        .status(400)
        .json({ mensaje: "Correo o contraseña con formato inválido." });
    }

    const usuario = await Usuario.buscarPorEmail(Email);
    const hashParaComparar = usuario ? usuario.Contrasena : HASH_RELLENO;
    const coincide = await bcrypt.compare(Contrasena, hashParaComparar);

    // Un solo mensaje para cualquier fallo: no revelamos cuál fue
    if (!usuario || usuario.Estado !== "Activo" || !coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { IDUsuario: usuario.IDUsuario, Nombre: usuario.Nombre, Rol: usuario.Rol },
      process.env.JWT_SECRET,
      { algorithm: "HS256", expiresIn: "8h" },
    );

    res.cookie("token", token, {
      ...opcionesCookie,
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      IDUsuario: usuario.IDUsuario,
      Nombre: usuario.Nombre,
      Email: usuario.Email,
      Rol: usuario.Rol,
    });
  },

  // Devuelve quién es el usuario de la sesión actual (leído de la base de datos)
  async me(req, res) {
    const usuario = await Usuario.buscarPorId(req.usuario.IDUsuario);
    if (!usuario || usuario.Estado !== "Activo") {
      res.clearCookie("token", opcionesCookie);
      return res.status(401).json({ mensaje: "Sesión inválida." });
    }
    res.json(usuario);
  },

  logout(req, res) {
    res.clearCookie("token", opcionesCookie);
    res.json({ mensaje: "Sesión cerrada." });
  },
};

module.exports = UsuarioController;