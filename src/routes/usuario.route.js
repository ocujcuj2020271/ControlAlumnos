const express = require('express');
const controladorUsuario = require('../controllers/usuario.controller');

const api = express.Router();

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

// ----------------ADMIN-----------------------
api.post('/login', controladorUsuario.Login);
api.post('/registrarAdmin', controladorUsuario.RegistrarAdmin);
api.post('/agregarEmpresa', [md_autenticacion.Auth, md_roles.verAdmin] ,controladorUsuario.RegistrarEmpresas);
api.put('/editarEmpresa/:idUsuario', [md_autenticacion.Auth, md_roles.verAdmin], controladorUsuario.EditarEmpresa  );
api.delete('/eliminarEmpresa/:idUsuario', [md_autenticacion.Auth, md_roles.verAdmin] , controladorUsuario.EliminarEmpresa);
api.get('/controlEmpresa',  [md_autenticacion.Auth, md_roles.verAdmin], controladorUsuario.controlEmpresa)

//----------------EMPRESAS---------------------
api.post('/agregarEmpleados',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.agregarEmpleados );
api.put('/editarEmpleados/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.editarEmpleados);
api.get('/buscarEmpleadoId/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.BuscarEmpleadoId);
api.get('/buscarEmpleadoNombre/:nombreEmpleado',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.BuscarEmpleadoNombre);
api.get('/buscarEmpleadoPuesto/:puesto',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.BuscarEmpleadoPuesto );
api.get('/buscardepartamento/:departamento',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.BuscarEmpleadoDepartamento);
api.delete('/eliminarEmpleados/:idEmpleado',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.eliminarEmpleados);
api.get('/todosLosEmpleados',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.TodoslosEmpleados);
api.get('/crearReporte',[md_autenticacion.Auth, md_roles.verEmpresas], controladorUsuario.pdf);



module.exports = api;