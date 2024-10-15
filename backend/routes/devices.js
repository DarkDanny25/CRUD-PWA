const express = require('express');
const Device = require('../models/devices');
const router = express.Router();

// Crear un dispositivo
router.post('/', async (req, res) => {
  const { name, type, brand, model, year } = req.body;
  const newDevice = new Device({ name, type, brand, model, year });

  try {
    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Leer todos los dispositivos
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Leer un dispositivo por ID
router.get('/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un dispositivo
router.put('/:id', async (req, res) => {
  const { name, type, brand, model, year } = req.body;

  try {
    const updatedDevice = await Device.findByIdAndUpdate(
      req.params.id,
      { name, type, brand, model, year },
      { new: true }
    );
    if (!updatedDevice) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(updatedDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar un dispositivo
router.delete('/:id', async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.params.id);
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json({ message: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;