// config/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // tu usuario de MySQL
  password: "", // tu contraseña
  database: "maxiabarrotes",
  port: 3307,
});

module.exports = pool;
