const express = require('express');
const controladorUsuario = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();


api.post('/registrarAdmin', controladorUsuario.RegistrarAdmin);


module.exports = api;