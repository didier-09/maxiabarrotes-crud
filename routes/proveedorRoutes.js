// routes/proveedorRoutes.js
const express = require("express");
const router = express.Router();
const ProveedorController = require("../controllers/proveedorController");

router.get("/", ProveedorController.listar);
router.get("/:id", ProveedorController.obtener);
router.post("/", ProveedorController.crear);
router.put("/:id", ProveedorController.actualizar);
router.delete("/:id", ProveedorController.eliminar);

module.exports = router;