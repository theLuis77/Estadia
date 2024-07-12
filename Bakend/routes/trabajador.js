// routes/trabajador.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Trabajador = require('../models/Trabajador');
const jwt = require('jsonwebtoken');

// Registro de trabajador
router.post('/registrar', async (req, res) => {
    const { nombreDeUsuario, contrasena } = req.body;
    try {
        let trabajador = await Trabajador.findOne({ nombreDeUsuario });
        if (trabajador) {
            return res.status(400).json({ msg: 'Trabajador ya existe' });
        }
        trabajador = new Trabajador({
            nombreDeUsuario,
            contrasena: await bcrypt.hash(contrasena, 10),
        });
        await trabajador.save();
        res.status(201).json({ msg: 'Trabajador registrado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Inicio de sesión de trabajador
router.post('/login', async (req, res) => {
    const { nombreDeUsuario, contrasena } = req.body;
    try {
        const trabajador = await Trabajador.findOne({ nombreDeUsuario });
        if (!trabajador) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }
        const esCoincidente = await bcrypt.compare(contrasena, trabajador.contrasena);
        if (!esCoincidente) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ id: trabajador._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Otras rutas (get, put, delete) se mantienen iguales


// // Obtener todos los trabajadores
// router.get('/', async (req, res) => {
//     try {
//         const trabajadores = await Trabajador.find();
//         res.json(trabajadores);
//     } catch (err) {
//         res.status(500).send('Error en el servidor');
//     }
// });

// // Actualizar un trabajador
// router.put('/:id', async (req, res) => {
//     const { nombreDeUsuario, contrasena } = req.body;
//     try {
//         let trabajador = await Trabajador.findById(req.params.id);
//         if (!trabajador) {
//             return res.status(404).json({ msg: 'Trabajador no encontrado' });
//         }
//         if (nombreDeUsuario) trabajador.nombreDeUsuario = nombreDeUsuario;
//         if (contrasena) trabajador.contrasena = await bcrypt.hash(contrasena, 10);

//         await trabajador.save();
//         res.json(trabajador);
//     } catch (err) {
//         res.status(500).send('Error en el servidor');
//     }
// });

// // Eliminar un trabajador
// router.delete('/:id', async (req, res) => {
//     try {
//         const trabajador = await Trabajador.findById(req.params.id);
//         if (!trabajador) {
//             return res.status(404).json({ msg: 'Trabajador no encontrado' });
//         }
//         await trabajador.remove();
//         res.json({ msg: 'Trabajador eliminado' });
//     } catch (err) {
//         res.status(500).send('Error en el servidor');
//     }
// });

 module.exports = router;
