// routes/ventaRoutes.js
const express = require("express");
const router = express.Router();
const VentaController = require("../controllers/ventaController");

router.get("/", VentaController.listar);
router.get("/resumen-hoy", VentaController.resumenHoy);
router.post("/", VentaController.crear);

module.exports = router;