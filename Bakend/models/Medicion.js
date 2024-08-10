// models/Medicion.js
const mongoose = require('mongoose');

const MedicionSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    estatura: Number,
    peso: Number,
    porcentajeDeGrasa: Number,
    imc: Number,
    fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Medicion', MedicionSchema);
