// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombreDeUsuario: { type: String, required: true, unique: true },
    contrasena: { type: String, required: true },
    numeroDeCliente: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
