// controllers/productoController.js
const Producto = require("../models/productoModel");

function validarProducto(body) {
  const errores = [];

  if (!body.Nombre || !body.Nombre.trim()) {
    errores.push("El nombre del producto es obligatorio.");
  }
  if (!body.IDCategoria) {
    errores.push("Debe seleccionar una categoría.");
  }
  if (!body.IDProveedor) {
    errores.push("Debe seleccionar un proveedor.");
  }
  if (!body.IDUsuario) {
    errores.push("Debe indicar el usuario que registra el producto.");
  }

  const precioCompra = Number(body.PrecioCompra);
  const precioVenta = Number(body.PrecioVenta);
  const stockActual = Number(body.StockActual);
  const stockMinimo = Number(body.StockMinimo);

  if (isNaN(precioCompra) || precioCompra < 0) {
    errores.push("El precio de compra debe ser un número mayor o igual a 0.");
  }
  if (isNaN(precioVenta) || precioVenta < 0) {
    errores.push("El precio de venta debe ser un número mayor o igual a 0.");
  }
  if (
    !isNaN(precioCompra) &&
    !isNaN(precioVenta) &&
    precioVenta < precioCompra
  ) {
    errores.push(
      "El precio de venta no puede ser menor que el precio de compra.",
    );
  }
  if (isNaN(stockActual) || stockActual < 0) {
    errores.push("El stock actual no puede ser negativo.");
  }
  if (isNaN(stockMinimo) || stockMinimo < 0) {
    errores.push("El stock mínimo no puede ser negativo.");
  }

  return errores;
}

const ProductoController = {
  async listar(req, res) {
    const productos = await Producto.listar();
    res.json(productos);
  },

  async obtener(req, res) {
    const id = Number(req.params.id);
    const producto = await Producto.buscarPorId(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(producto);
  },

  async crear(req, res) {
    const errores = validarProducto(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      const nuevoId = await Producto.crear(req.body);
      const producto = await Producto.buscarPorId(nuevoId);
      res.status(201).json(producto);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["El código de barras ya existe."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear el producto." });
    }
  },

  async actualizar(req, res) {
    const id = Number(req.params.id);
    const existente = await Producto.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const errores = validarProducto(req.body);
    if (errores.length) {
      return res.status(400).json({ errores });
    }

    try {
      await Producto.actualizar(id, req.body);
      const actualizado = await Producto.buscarPorId(id);
      res.json(actualizado);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ errores: ["El código de barras ya existe."] });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el producto." });
    }
  },

  async eliminar(req, res) {
    const id = Number(req.params.id);
    const existente = await Producto.buscarPorId(id);
    if (!existente) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    try {
      await Producto.eliminar(id);
      res.json({ mensaje: "Producto eliminado correctamente." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el producto." });
    }
  },
};

module.exports = ProductoController;