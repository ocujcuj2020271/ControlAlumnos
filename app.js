const express = require('express');
const cors = require('cors');
const app = express();

const UsuarioRutas = require('./src/routes/usuario.route');


app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());


app.use('/api', UsuarioRutas);



module.exports = app;