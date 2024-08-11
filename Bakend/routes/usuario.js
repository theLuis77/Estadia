const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registro de usuario
router.post('/registrar', async (req, res) => {
    const { nombreDeUsuario, contrasena } = req.body;
    try {
        let usuario = await Usuario.findOne({ nombreDeUsuario });
        if (usuario) {
            return res.status(400).json({ msg: 'Usuario ya existe' });
        }
        usuario = new Usuario({
            nombreDeUsuario,
            contrasena: await bcrypt.hash(contrasena, 10),
        });
        await usuario.save();
        res.status(201).json({ msg: 'Usuario registrado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Inicio de sesión de usuario
router.post('/login', async (req, res) => {
    const { nombreDeUsuario, contrasena } = req.body;
    try {
        const usuario = await Usuario.findOne({ nombreDeUsuario });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }
        const esCoincidente = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!esCoincidente) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
