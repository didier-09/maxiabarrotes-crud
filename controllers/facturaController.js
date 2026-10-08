// controllers/facturaController.js
const db = require("../config/db");
const Factura = require("../models/facturaModel");
const Venta = require("../models/ventaModel");

const FacturaController = {
  async crear(req, res) {
    const { items, IDUsuario } = req.body;
    // items: [{ IDProducto, Cantidad }, { IDProducto, Cantidad }, ...]

    if (!Array.isArray(items) || items.length === 0 || !IDUsuario) {
      return res.status(400).json({ mensaje: "La factura necesita al menos un producto." });
    }

    const conexion = await db.getConnection();
    try {
      await conexion.beginTransaction();

      const idFactura = await Factura.crear(IDUsuario, conexion);
      let totalFactura = 0;

      for (const item of items) {
        const [productos] = await conexion.query(
          "SELECT * FROM producto WHERE IDProducto = ? FOR UPDATE",
          [item.IDProducto],
        );
        const producto = productos[0];

        if (!producto) {
          await conexion.rollback();
          return res.status(404).json({ mensaje: `Producto ID ${item.IDProducto} no encontrado.` });
        }

        if (producto.StockActual < item.Cantidad) {
          await conexion.rollback();
          return res.status(400).json({
            mensaje: `Stock insuficiente para "${producto.Nombre}". Disponible: ${producto.StockActual}.`,
          });
        }

        const precioUnitario = Number(producto.PrecioVenta);
        const totalLinea = precioUnitario * Number(item.Cantidad);
        totalFactura += totalLinea;

        await Venta.crearConFactura(
          idFactura,
          {
            IDProducto: item.IDProducto,
            Cantidad: item.Cantidad,
            PrecioUnitario: precioUnitario,
            Total: totalLinea,
            IDUsuario,
          },
          conexion,
        );

        await conexion.query(
          "UPDATE producto SET StockActual = StockActual - ? WHERE IDProducto = ?",
          [item.Cantidad, item.IDProducto],
        );
      }

      await Factura.actualizarTotal(idFactura, totalFactura, conexion);
      await conexion.commit();

      res.status(201).json({ IDFactura: idFactura, Total: totalFactura });
    } catch (error) {
      await conexion.rollback();
      console.error(error);
      res.status(500).json({ mensaje: "Error al generar la factura." });
    } finally {
      conexion.release();
    }
  },

  async obtener(req, res) {
    const factura = await Factura.obtenerConDetalle(Number(req.params.id));
    if (!factura) {
      return res.status(404).json({ mensaje: "Factura no encontrada." });
    }
    res.json(factura);
  },
};

module.exports = FacturaController;