const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Registro de usuario
router.post('/registrar', async (req, res) => {
    const { nombreDeUsuario, contrasena, numeroDeCliente } = req.body;
    try {
        let usuario = await Usuario.findOne({ nombreDeUsuario });
        if (usuario) {
            return res.status(400).json({ msg: 'Usuario ya existe' });
        }
        usuario = new Usuario({
            nombreDeUsuario,
            contrasena: await bcrypt.hash(contrasena, 10),
            numeroDeCliente,
        });
        await usuario.save();
        res.status(201).json({ msg: 'Usuario registrado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    const { nombreDeUsuario, contrasena, numeroDeCliente } = req.body;
    try {
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        if (nombreDeUsuario) usuario.nombreDeUsuario = nombreDeUsuario;
        if (contrasena) usuario.contrasena = await bcrypt.hash(contrasena, 10);
        if (numeroDeCliente) usuario.numeroDeCliente = numeroDeCliente;

        await usuario.save();
        res.json(usuario);
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        await usuario.remove();
        res.json({ msg: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
