const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Registro de cliente
router.post('/registrar', async (req, res) => {
    const { id, turno, socio, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;
    try {
        let cliente = new Cliente({
            id,
            turno,
            socio,
            descripcion,
            fechaDeNacimiento,
            edad,
            numeroTelefonico,
            correoElectronico,
            ocupacion,
        });
        await cliente.save();
        res.status(201).json({ msg: 'Cliente registrado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar un cliente
router.put('/:id', async (req, res) => {
    const { turno, socio, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;
    try {
        let cliente = await Cliente.findOne({ id: req.params.id });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        if (turno) cliente.turno = turno;
        if (socio) cliente.socio = socio;
        if (descripcion) cliente.descripcion = descripcion;
        if (fechaDeNacimiento) cliente.fechaDeNacimiento = fechaDeNacimiento;
        if (edad) cliente.edad = edad;
        if (numeroTelefonico) cliente.numeroTelefonico = numeroTelefonico;
        if (correoElectronico) cliente.correoElectronico = correoElectronico;
        if (ocupacion) cliente.ocupacion = ocupacion;

        await cliente.save();
        res.json(cliente);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar un cliente
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ id: req.params.id });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        await cliente.remove();
        res.json({ msg: 'Cliente eliminado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
