const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { schemas } = require('../createModels');

const Log = mongoose.model('logs', schemas.logSchema, 'logs');

// Create
router.post('/add', async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find().sort({ time: -1 }); // Sort by time, newest first
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update (Note: Updating logs is often not recommended for audit trails)
router.put('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json(log);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete (Note: Deleting logs is often not recommended for audit trails)
router.delete('/:id', async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;