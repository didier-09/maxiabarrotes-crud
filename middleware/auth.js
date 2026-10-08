// middleware/auth.js
const jwt = require("jsonwebtoken");

function exigirSesion(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ mensaje: "Debes iniciar sesión." });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Sesión inválida o expirada." });
  }
}

function exigirRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.Rol)) {
      return res
        .status(403)
        .json({ mensaje: "No tienes permiso para esta acción." });
    }
    next();
  };
}

// El usuario que registra una acción sale de la sesión,
// nunca de lo que mande el navegador
function usuarioDeSesion(req, res, next) {
  req.body = req.body || {};
  req.body.IDUsuario = req.usuario.IDUsuario;
  next();
}

module.exports = { exigirSesion, exigirRol, usuarioDeSesion };