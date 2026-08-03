// routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");

router.get("/", UsuarioController.listar);
router.get("/:id", UsuarioController.obtener);
router.post("/", UsuarioController.crear);
router.post("/login", UsuarioController.login);
router.put("/:id", UsuarioController.actualizar);
router.delete("/:id", UsuarioController.eliminar);

module.exports = router;