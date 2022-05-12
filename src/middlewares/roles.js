exports.verAdmin = function (req, res, next) {
    if (req.user.rol !== "ROL_ADMIN")
      return res
        .status(403)
        .send({ mesnaje: "Sin permisos" });
    next();
  };
  
 exports.verCliente = function (req, res, next) {
    if (req.user.rol !== "ROL_CLIENTE")
      return res.status(403).send({ mesnaje: "Sin permisos" });
    next();
  };
  