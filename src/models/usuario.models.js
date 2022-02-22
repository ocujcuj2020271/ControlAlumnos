const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
    email: String,
    password: String,
    rol: String,  
})

module.exports = mongoose.model('Usuarios',usuarioSchema);