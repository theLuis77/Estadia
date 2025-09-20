const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { isEmail, isMobilePhone } = require('validator');

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No hay token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Registro de usuario
router.post('/registrar', async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente, turno, nombre, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

  // Validar campos obligatorios y formato
  if (!nombreDeUsuario || !contrasena || !numeroDeCliente || !turno || !nombre || !fechaDeNacimiento || !edad || !numeroTelefonico || !correoElectronico || !ocupacion) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios' });
  }
  if (!isEmail(correoElectronico)) {
    return res.status(400).json({ msg: 'Correo electrónico inválido' });
  }
  if (!isMobilePhone(numeroTelefonico, 'any')) {
    return res.status(400).json({ msg: 'Número telefónico inválido' });
  }

  try {
    let usuario = await Usuario.findOne({ nombreDeUsuario });
    if (usuario) {
      return res.status(400).json({ msg: 'Usuario ya existe' });
    }

    // Crear nuevo usuario
    usuario = new Usuario({
      nombreDeUsuario,
      contrasena: await bcrypt.hash(contrasena, 10),
      numeroDeCliente,
      turno,
      nombre,
      descripcion,
      fechaDeNacimiento,
      edad,
      numeroTelefonico,
      correoElectronico,
      ocupacion
    });

    await usuario.save();
    res.status(201).json({ msg: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Inicio de sesión de usuario
router.post('/iniciar-sesion', async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente } = req.body;

  try {
    let usuario = await Usuario.findOne({ nombreDeUsuario, numeroDeCliente });
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
    console.error('Error en el servidor:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Ruta de búsqueda
router.get('/buscar', async (req, res) => {
  const { nombre, nombreDeUsuario, numeroDeCliente } = req.query;

  try {
    const query = {};
    if (nombre) query.nombre = nombre;
    if (nombreDeUsuario) query.nombreDeUsuario = nombreDeUsuario;
    if (numeroDeCliente) query.numeroDeCliente = numeroDeCliente;

    const usuarios = await Usuario.find(query);
    res.json(usuarios);
  } catch (err) {
    console.error('Error en la búsqueda:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    console.error('Error al obtener usuario:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

// Ruta para actualizar un usuario por ID
router.put('/:id', authMiddleware, async (req, res) => {
  const { nombreDeUsuario, contrasena, numeroDeCliente, turno, nombre, descripcion, fechaDeNacimiento, edad, numeroTelefonico, correoElectronico, ocupacion } = req.body;

  try {
    let usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    usuario.nombreDeUsuario = nombreDeUsuario || usuario.nombreDeUsuario;
    usuario.numeroDeCliente = numeroDeCliente || usuario.numeroDeCliente;
    usuario.turno = turno || usuario.turno;
    usuario.nombre = nombre || usuario.nombre;
    usuario.descripcion = descripcion || usuario.descripcion;
    usuario.fechaDeNacimiento = fechaDeNacimiento || usuario.fechaDeNacimiento;
    usuario.edad = edad || usuario.edad;
    usuario.numeroTelefonico = numeroTelefonico || usuario.numeroTelefonico;
    usuario.correoElectronico = correoElectronico || usuario.correoElectronico;
    usuario.ocupacion = ocupacion || usuario.ocupacion;

    if (contrasena) {
      usuario.contrasena = await bcrypt.hash(contrasena, 10);
    }

    await usuario.save();
    res.json({ msg: 'Usuario actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err.message);
    res.status(500).json({ msg: 'Error en el servidor', error: err.message });
  }
});

module.exports = router;
