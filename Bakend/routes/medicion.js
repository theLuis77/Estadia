const express = require('express');
const router = express.Router();
const Medicion = require('../models/Medicion');
const { check, validationResult } = require('express-validator');

// Registro de medición
router.post('/registrar', [
    check('clienteId', 'El ID del cliente es obligatorio').not().isEmpty(),
    check('estatura', 'La estatura es obligatoria').not().isEmpty(),
    check('peso', 'El peso es obligatorio').not().isEmpty(),
    check('porcentajeDeGrasa', 'El porcentaje de grasa es obligatorio').not().isEmpty(),
    check('imc', 'El IMC es obligatorio').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
    }

    const { clienteId, estatura, peso, porcentajeDeGrasa, imc } = req.body;
    try {
        let medicion = new Medicion({
            clienteId,
            estatura,
            peso,
            porcentajeDeGrasa,
            imc,
        });
        await medicion.save();
        res.status(201).json({ msg: 'Medición registrada', medicion });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Obtener todas las mediciones de un cliente
router.get('/:clienteId', async (req, res) => {
    try {
        const mediciones = await Medicion.find({ clienteId: req.params.clienteId });
        res.json(mediciones);
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Actualizar una medición
router.put('/:id', async (req, res) => {
    const { estatura, peso, porcentajeDeGrasa, imc } = req.body;
    try {
        let medicion = await Medicion.findById(req.params.id);
        if (!medicion) {
            return res.status(404).json({ msg: 'Medición no encontrada' });
        }
        if (estatura) medicion.estatura = estatura;
        if (peso) medicion.peso = peso;
        if (porcentajeDeGrasa) medicion.porcentajeDeGrasa = porcentajeDeGrasa;
        if (imc) medicion.imc = imc;

        await medicion.save();
        res.json({ msg: 'Medición actualizada', medicion });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Eliminar una medición
router.delete('/:id', async (req, res) => {
    try {
        const medicion = await Medicion.findById(req.params.id);
        if (!medicion) {
            return res.status(404).json({ msg: 'Medición no encontrada' });
        }
        await medicion.remove();
        res.json({ msg: 'Medición eliminada' });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

module.exports = router;
