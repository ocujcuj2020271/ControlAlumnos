const Usuario = require('../models/usuario.models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function RegistrarAdmin(req,res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    usuarioModel.nombre = 'Admin';
    usuarioModel.email = 'Admin';
    usuarioModel.rol = 'ROL_Admin'

    Usuario.find({email: 'Admin'},(err, usuarioEncontrado) => {
        if (usuarioEncontrado.length === 0) {
            
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
                    if(!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar el Usuario'});

                    return res.status(200).send({usuario: usuarioGuardado});
                });
            });
        }else{
            return res.status(500).send({ mensaje:'este correo, ya se encuentra utilizado'});
        }
    })

}

module.exports = {
    RegistrarAdmin,
}