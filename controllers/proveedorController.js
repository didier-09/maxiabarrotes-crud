// controllers/proveedorController.js
const Proveedor = require("../models/proveedorModel");

function validarProveedor(body) {
  const errores = [];

  if (!body.Nombre || !body.Nombre.trim()) {
    errores.push("El nombre del proveedor es obligatorio.");
  }

  return errores;
}

const ProveedorController = {
  async listar(req, res) {
    const proveedores = await Proveedor.listar();
    res.json(proveedores);
  },

  async obtener(req, res) {
    const id = Number(req.params.id);
    const proveedor = await Proveedor.buscarPorId(id);
    if (!proveedor) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    res.json(proveedor);
  },

  async crear(req, res) {
    const errores = validarProveedor(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      const nuevoId = await Proveedor.crear(req.body);
      const proveedor = await Proveedor.buscarPorId(nuevoId);
      res.status(201).json(proveedor);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ya existe un proveedor con esos datos."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear el proveedor." });
    }
  },

  async actualizar(req, res) {
    const id = Number(req.params.id);
    const existente = await Proveedor.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    const errores = validarProveedor(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      await Proveedor.actualizar(id, req.body);
      const actualizado = await Proveedor.buscarPorId(id);
      res.json(actualizado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ya existe un proveedor con esos datos."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el proveedor." });
    }
  },

  async eliminar(req, res) {
    const id = Number(req.params.id);
    const existente = await Proveedor.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }

    try {
      await Proveedor.eliminar(id);
      res.json({ mensaje: "Proveedor eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el proveedor." });
    }
  },
};

module.exports = ProveedorController;