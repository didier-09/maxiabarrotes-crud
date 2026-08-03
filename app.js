// app.js
const express = require("express");
const app = express();
app.use(express.static("public"));
const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/productos", productoRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/proveedores", proveedorRoutes);
app.use("/usuarios", usuarioRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});