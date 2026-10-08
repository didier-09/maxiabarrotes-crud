// controllers/egresoController.js
const Egreso = require("../models/egresoModel");

const EgresoController = {
  async listar(req, res) {
    const egresos = await Egreso.listar();
    res.json(egresos);
  },

  async crear(req, res) {
    const { Concepto, Monto, IDUsuario } = req.body;

    if (!Concepto || !Concepto.trim() || !Monto || Monto <= 0 || !IDUsuario) {
      return res.status(400).json({ mensaje: "Datos de egreso inválidos." });
    }

    try {
      const nuevoId = await Egreso.crear(req.body);
      res.status(201).json({ IDEgreso: nuevoId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al registrar el egreso." });
    }
  },

  async eliminar(req, res) {
    const id = Number(req.params.id);
    try {
      await Egreso.eliminar(id);
      res.json({ mensaje: "Egreso eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el egreso." });
    }
  },

  async resumenMes(req, res) {
    const resumen = await Egreso.resumenMes();
    res.json(resumen);
  },
};

module.exports = EgresoController;