// app.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const app = express();

// Si falta el secreto, el servidor no arranca (mejor eso que arrancar inseguro)
if (!process.env.JWT_SECRET) {
  console.error("Falta JWT_SECRET en el archivo .env");
  process.exit(1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(express.static("public"));

const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
const egresoRoutes = require("./routes/egresoRoutes");
const facturaRoutes = require("./routes/facturaRoutes");

app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/proveedores", proveedorRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/ventas", ventaRoutes);
app.use("/egresos", egresoRoutes);
app.use("/facturas", facturaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});