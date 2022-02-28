exports.verAdmin = function (req, res, next) {
    if(req.user.rol !== 'ROL_Admin') return res.status(403).send({mensaje: "Solo puede acceder el Administrador"})

    next();
}

exports.verEmpresas = function (req, res, next) {
    if(req.user.rol != "ROL_Empresa") return res.status(403).send({mensaje: 'Solo puede acceder la Empresas'});

    next();
    
}