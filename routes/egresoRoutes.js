// routes/egresoRoutes.js
const express = require("express");
const router = express.Router();
const EgresoController = require("../controllers/egresoController");

router.get("/", EgresoController.listar);
router.get("/resumen-mes", EgresoController.resumenMes);
router.post("/", EgresoController.crear);
router.delete("/:id", EgresoController.eliminar);

module.exports = router;