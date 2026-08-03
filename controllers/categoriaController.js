// controllers/categoriaController.js
const Categoria = require("../models/categoriaModel");

function validarCategoria(body) {
  const errores = [];

  if (!body.Nombre || !body.Nombre.trim()) {
    errores.push("El nombre de la categoría es obligatorio.");
  }

  return errores;
}

const CategoriaController = {
  async listar(req, res) {
    const categorias = await Categoria.listar();
    res.json(categorias);
  },

  async obtener(req, res) {
    const id = Number(req.params.id);
    const categoria = await Categoria.buscarPorId(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }
    res.json(categoria);
  },

  async crear(req, res) {
    const errores = validarCategoria(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      const nuevoId = await Categoria.crear(req.body);
      const categoria = await Categoria.buscarPorId(nuevoId);
      res.status(201).json(categoria);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ya existe una categoría con ese nombre."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear la categoría." });
    }
  },

  async actualizar(req, res) {
    const id = Number(req.params.id);
    const existente = await Categoria.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    const errores = validarCategoria(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      await Categoria.actualizar(id, req.body);
      const actualizada = await Categoria.buscarPorId(id);
      res.json(actualizada);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["Ya existe una categoría con ese nombre."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar la categoría." });
    }
  },

  async eliminar(req, res) {
    const id = Number(req.params.id);
    const existente = await Categoria.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    try {
      await Categoria.eliminar(id);
      res.json({ mensaje: "Categoría eliminada correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar la categoría." });
    }
  },
};

module.exports = CategoriaController;