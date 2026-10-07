// controllers/ventaController.js
const db = require("../config/db");
const Venta = require("../models/ventaModel");
const Producto = require("../models/productoModel");

const VentaController = {
  async listar(req, res) {
    const ventas = await Venta.listar();
    res.json(ventas);
  },

  async resumenHoy(req, res) {
    const resumen = await Venta.resumenHoy();
    res.json(resumen);
  },

  async crear(req, res) {
    const { IDProducto, Cantidad, IDUsuario } = req.body;

    if (!IDProducto || !Cantidad || Cantidad <= 0 || !IDUsuario) {
      return res.status(400).json({ mensaje: "Datos de venta inválidos." });
    }

    const conexion = await db.getConnection();
    try {
      await conexion.beginTransaction();

      const [productos] = await conexion.query(
        "SELECT * FROM producto WHERE IDProducto = ? FOR UPDATE",
        [IDProducto],
      );
      const producto = productos[0];

      if (!producto) {
        await conexion.rollback();
        return res.status(404).json({ mensaje: "Producto no encontrado." });
      }

      if (producto.StockActual < Cantidad) {
        await conexion.rollback();
        return res.status(400).json({ mensaje: "Stock insuficiente para esta venta." });
      }

      const precioUnitario = Number(producto.PrecioVenta);
      const total = precioUnitario * Number(Cantidad);

      const idVenta = await Venta.crear(
        { IDProducto, Cantidad, PrecioUnitario: precioUnitario, Total: total, IDUsuario },
        conexion,
      );

      await conexion.query(
        "UPDATE producto SET StockActual = StockActual - ? WHERE IDProducto = ?",
        [Cantidad, IDProducto],
      );

      await conexion.commit();
      res.status(201).json({ IDVenta: idVenta, Total: total });
    } catch (error) {
      await conexion.rollback();
      console.error(error);
      res.status(500).json({ mensaje: "Error al registrar la venta." });
    } finally {
      conexion.release();
    }
  },
};

module.exports = VentaController;