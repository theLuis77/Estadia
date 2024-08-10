// models/Cliente.js
const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    turno: String,
    socio: String,
    descripcion: String,
    fechaDeNacimiento: Date,
    edad: Number,
    numeroTelefonico: String,
    correoElectronico: String,
    ocupacion: String,
});

module.exports = mongoose.model('Cliente', ClienteSchema);
