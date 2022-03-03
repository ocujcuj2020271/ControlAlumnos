const Usuario = require('../models/usuario.models');
const Empleados = require('../models/empleados.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const PDF = require('pdfkit-construct');
const fs = require('fs');

const app = require('express')();

var doc = new PDF();


//----------------ADMIN---------------------

function RegistrarAdmin(req, res) {
    var usuarioModel = new Usuario();

    Usuario.find({ rol: 'ROL_Admin' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            return console.log({ mensaje: "Ya existe un Administrador" })
        } else {

            usuarioModel.nombre = 'Admin';
            usuarioModel.email = 'Admin';
            usuarioModel.rol = 'ROL_Admin'
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) console.log({ mensaje: 'Error en la peticion' });
                    if (!usuarioGuardado) return console.log({ mensaje: 'Error al agregar el Usuario' });

                    return console.log({ usuario: usuarioGuardado });
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
        });

    } else {
        return res.status(200).send({ mensaje: empleadoGuardado });
    }
}

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
        Empleados.find({ _id: idEmpleado }, (err, empleadoEncontrado) => {
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

    Empleados.findOne({ nombre: Empleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {
        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'no puedes ver empleados que no sean tuyos' });
        }
        Empleados.find({ nombre: Empleado }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empleado' });

            return res.status(200).send({ empleado: empleadoEncontrado })
        }
        );
    }
    )

}

function BuscarEmpleadoPuesto(req, res) {
    const puestoEmpleado = req.params.puesto;

    Empleados.findOne({ puesto: puestoEmpleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {


        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'no puedes ver empleados que no sean tuyos' });
        }
        Empleados.find({ puesto: puestoEmpleado }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empleado' });

            return res.status(200).send({ empleado: empleadoEncontrado })
        }
        );
    }
    )

}

function BuscarEmpleadoDepartamento(req, res) {
    const departamentoEmpleado = req.params.departamento;

    Empleados.findOne({ departamento: departamentoEmpleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {

        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'no puedes ver empleados que no sean tuyos' });
        }
        Empleados.find({ departamento: departamentoEmpleado }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEncontrado) return res.status(500).send({ mensaje: 'Error al buscar empleado' });

            return res.status(200).send({ empleado: empleadoEncontrado })
        }
        );
    }
    )

}


function eliminarEmpleados(req, res) {
    var idEmpleado = req.params.idEmpleado;


    Empleados.findOne({ _id: idEmpleado, idEmpresa: req.user.sub }, (err, empresaEncontrada) => {

        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'No puedes eliminar Empleados de otra Empresa' });
        }

        Empleados.findByIdAndDelete(idEmpleado, (err, empleadoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!empleadoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar  Empleado' });

            return res.status(200).send({ empleado: 'se elimino el empleado', empleadoEliminado })
        });
    }
    )
}


function TodoslosEmpleados(req, res) {


    Empleados.findOne({ idEmpresa: req.user.sub }, (err, empresaEncontrada) => {


        if (!empresaEncontrada) {
            return res.status(400).send({ mensaje: 'No puedes ver Empleados de otra Empresa' });
        }
        Empleados.find({}, (err, empleadosEncontrados) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
            if (!empleadosEncontrados) return res.status(500).send({ mensaje: 'Error al obtener usuario' })

            return res.status(200).send({ Empleados: empleadosEncontrados })
        });
    }
    )

}

function pdf(req, res) {



    Empleados.find({ idEmpresa: req.user.sub }, (err, empresaEncontrada) => {
        doc.pipe(fs.createWriteStream('reportes/' + req.user.nombre + '.pdf'));

        for (var i = 0; i < empresaEncontrada.length; i++) {


            let date = new Date();
            let output = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
            

            const empleados = [
                {
                    No: i,
                    nombre: empresaEncontrada[i].nombre,
                    apellido: empresaEncontrada[i].apellido,
                    puesto: empresaEncontrada[i].puesto,
                    departamento: empresaEncontrada[i].departamento
                }
                
            ];

            doc.setDocumentHeader({
                height: '15'
            }, () => {
                doc.fontSize(20).text("Reporte de Empleados de " + req.user.nombre + ":", {
                    with: 420,
                    align: 'center',
                });
                doc.fontSize(12);
                doc.text("Guatemala "+ output, {
                    with: 420,
                    align: 'right',
                });
            });

            


            doc.addTable(
                [
                    { key: 'No', label: 'No', align: 'left' },
                    { key: 'nombre', label: 'Nombre', align: 'left' },
                    { key: 'apellido', label: 'Apellido', align: 'left' },
                    { key: 'puesto', label: 'Puesto', align: 'left' },
                    { key: 'departamento', label: 'Departamento', align: 'right' }
                ], empleados, {
                border: null,
                width: "fill_body",
                striped: true,
                stripedColors: ["#f6f6f6", "#d6c4dd"],
                cellsPadding: 10,
                marginLeft: 45,
                marginRight: 45,
                headAlign: 'center'
            });

            

        }



        doc.render();
        doc.end();
    })
    return res.status(200).send("PDF generado")
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
    BuscarEmpleadoNombre,
    BuscarEmpleadoPuesto,
    BuscarEmpleadoDepartamento,
    eliminarEmpleados,
    TodoslosEmpleados,
    pdf
}