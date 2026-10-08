// routes/usuarioRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const { exigirSesion, exigirRol } = require("../middleware/auth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { mensaje: "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const registroLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { mensaje: "Demasiados registros desde esta conexión. Intenta más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Públicas
router.post("/login", loginLimiter, UsuarioController.login);
router.post("/registro", registroLimiter, UsuarioController.registro);
router.post("/logout", UsuarioController.logout);

// Cualquier usuario con sesión (va antes de "/:id" a propósito)
router.get("/me", exigirSesion, UsuarioController.me);

// Solo administrador
router.get("/", exigirSesion, exigirRol("Administrador"), UsuarioController.listar);
router.get("/:id", exigirSesion, exigirRol("Administrador"), UsuarioController.obtener);
router.post("/", exigirSesion, exigirRol("Administrador"), UsuarioController.crear);
router.put("/:id", exigirSesion, exigirRol("Administrador"), UsuarioController.actualizar);
router.delete("/:id", exigirSesion, exigirRol("Administrador"), UsuarioController.eliminar);

module.exports = router;