const Usuario = require('../models/usuario.models');
const Empleados = require('../models/empleados.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//----------------ADMIN---------------------

function RegistrarAdmin(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    Usuario.find({ rol: 'ROL_Admin' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return res.status(500).send({ mensaje: "Ya existe un Administrador" })
        } else {

            usuarioModel.nombre = 'Admin';
            usuarioModel.email = 'Admin';
            usuarioModel.rol = 'ROL_Admin'
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al agregar el Usuario' });

                    return res.status(200).send({ usuario: usuarioGuardado });
                });
            });
        }
    })

}


function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {

                        return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500).send({ mensaje: 'Las contrasena no coincide' });
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'Error, el correo no  se encuentra registrado.' })
        }
    })
}

function RegistrarEmpresas(req, res) {
    var parametros = req.body;
    var modeloUsuario = new Usuario();

    if (parametros.nombre) {
        modeloUsuario.nombre = parametros.nombre;
        modeloUsuario.email = parametros.email;
        modeloUsuario.rol = 'ROL_Empresa';

        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
            modeloUsuario.password = passwordEncriptada;

            modeloUsuario.save((err, usuarioGuardado) => {
                if (err) return res.status(500).send({ mensaje: 'Error ane la peticion' })
                if (!usuarioGuardado) return res.status(500).send({ mensaje: 'Error al registrar Usuario' });


                return res.status(200).send({ usuario: usuarioGuardado });
            });

        })



    } else {
        return res.status(500).send({ mensaje: 'Debe de ingresar los parametros obligatorios' })
    }
}

function EditarEmpresa(req, res) {
    var idUser = req.params.idUsuario;
    var parametros = req.body;

    Usuario.findByIdAndUpdate({ _id: idUser }, parametros, { new: true },
        (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

            return res.status(200).send({ usuario: usuarioActualizado })

        })
}

function EliminarEmpresa(req, res) {
    var idUser = req.params.idUsuario;

    Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar la Empresa' });

        return res.status(200).send({ usuario: 'se elimino la empresa', usuarioEliminado })
    });
}

function controlEmpresa(req, res) {
    Usuario.find({}, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener la empresas' })

        return res.status(200).send({ usuario: usuarioEncontrado })
    })
}


//----------------------------EMPRESAS---------------------------------------------
function agregarEmpleados(req, res) {
    const parametros = req.body;
    const modeloEmpleados = new Empleados();

    if (parametros.nombre) {
        modeloEmpleados.nombre = parametros.nombre;
        modeloEmpleados.apellido = parametros.apellido;
        modeloEmpleados.puesto = parametros.puesto;
        modeloEmpleados.departamento = parametros.departamento;
        modeloEmpleados.idEmpresa = req.user.sub;

        modeloEmpleados.save((err, empleadoGuardado) => {
            if (err) return res.status(400).send({ mensaje: 'Error en la peticion' });
            if (!empleadoGuardado) return res.status(404).send({ mensaje: 'Error al agregar un Empleado' });
        })

    } else {
        return res.status(404).send({ mensaje: 'Debe enviar los parametros obligatorios' })
    }
}

//----------------------------------------------------------------------------------
function editarEmpleados(req, res) {
    const parametros = req.body;
    const idEmpleado = req.params.idEmpleado;

    Empleados.findOne({ _id: idEmpleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {
        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: "No puedes editar un empleado que no sea de tu Empresa" });
        }
        Empleados.findByIdAndUpdate(idEmpleado, parametros, { new: true },
            (err, empleadoActualizado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!empleadoActualizado) return res.status(500).send({ mensaje: 'Error al Editar el Empleado' });

                return res.status(200).send({ empleado: empleadoActualizado })
            }
        );
    }
    )
}

function BuscarEmpleadoId(req, res) {
    const idEmpleado = req.params.idEmpleado;

    Empleados.findOne({ _id: idEmpleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {
        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: "No puedes editar un empleado que no sea de tu Empresa" });
        }
        Empleados.find({_id: idEmpleado}, (err, empleadoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empleado' });

                return res.status(200).send({ empleado: empleadoEncontrado })
            }
        );
    }
    )
}

function BuscarEmpleadoNombre(req, res) {
    const Empleado = req.params.nombreEmpleado;

    Empleados.findOne({ nombre : Empleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {
        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'no puedes ver empleados que no sean tuyos' });
        }
        Empleados.find({ nombre: Empleado}, (err, empleadoEncontrado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empleado' });

                return res.status(200).send({ empleado: empleadoEncontrado })
            }
        );
    }
    )

}



module.exports = {
    EliminarEmpresa,
    EditarEmpresa,
    Login,
    RegistrarAdmin,
    RegistrarEmpresas,
    controlEmpresa,
    agregarEmpleados,
    editarEmpleados,
    BuscarEmpleadoId,
    BuscarEmpleadoNombre
}