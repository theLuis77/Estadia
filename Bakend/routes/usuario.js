const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Cliente = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registro de cliente (si no lo tienes ya)
router.post('/registrar', async (req, res) => {
  const { nombreDeUsuario, contrasena } = req.body;
  try {
    let cliente = await Cliente.findOne({ nombreDeUsuario });
    if (cliente) {
      return res.status(400).json({ msg: 'Cliente ya existe' });
    }
    cliente = new Cliente({
      nombreDeUsuario,
      contrasena: await bcrypt.hash(contrasena, 10),
    });
    await cliente.save();
    res.status(201).json({ msg: 'Cliente registrado' });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Inicio de sesión de cliente
router.post('/login', async (req, res) => {
  const { nombreDeUsuario, contrasena } = req.body;
  try {
    const cliente = await Cliente.findOne({ nombreDeUsuario });
    if (!cliente) {
      return res.status(400).json({ msg: 'Credenciales incorrectas' });
    }
    const esCoincidente = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!esCoincidente) {
      return res.status(400).json({ msg: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ id: cliente._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
