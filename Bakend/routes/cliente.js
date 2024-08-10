const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Registro de cliente
router.post('/registrar', async (req, res) => {
    const { id, turno, socio, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

    // Validar campos requeridos
    if (!id || !fechaDeNacimiento || !numeroTelefonico || !correoElectronico) {
        return res.status(400).json({ msg: 'Todos los campos requeridos deben estar presentes' });
    }

    try {
        // Verificar si el cliente ya existe
        let clienteExistente = await Cliente.findOne({ id });
        if (clienteExistente) {
            return res.status(400).json({ msg: 'El cliente ya está registrado' });
        }

        // Crear un nuevo cliente
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
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


// Obtener un cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ id: req.params.id });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar un cliente por ID
router.put('/:id', async (req, res) => {
    const { turno, socio, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

    try {
        let cliente = await Cliente.findOne({ id: req.params.id });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        cliente.turno = turno;
        cliente.socio = socio;
        cliente.descripcion = descripcion;
        cliente.fechaDeNacimiento = fechaDeNacimiento;
        cliente.edad = edad;
        cliente.numeroTelefonico = numeroTelefonico;
        cliente.correoElectronico = correoElectronico;
        cliente.ocupacion = ocupacion;

        await cliente.save();
        res.json(cliente);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar un cliente por ID
router.delete('/:id', async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ id: req.params.id });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        await cliente.remove();
        res.json({ msg: 'Cliente eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
