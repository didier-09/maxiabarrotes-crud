
const express = require("express");
const router = express.Router();
const FacturaController = require("../controllers/facturaController");

router.post("/", FacturaController.crear);
router.get("/:id", FacturaController.obtener);

module.exports = router;