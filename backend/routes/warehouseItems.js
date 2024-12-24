const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { schemas } = require("../createModels");

const WarehouseItem = mongoose.model("warehouseItem", schemas.warehouseItemSchema, "warehouseItem");
// Get all warehouse items
router.get('/layout', async (req, res) => {
  try {
    const items = await WarehouseItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new warehouse item
router.post('/layout', async (req, res) => {
  const item = new WarehouseItem({
    type: req.body.type,
    size: req.body.size,
    position: req.body.position,
    quantity: req.body.quantity
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a warehouse item
router.put('/layout/:id', async (req, res) => {
  try {
    const item = await WarehouseItem.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }

    if (req.body.position != null) {
      item.position = req.body.position;
    }
    item.updatedAt = Date.now();

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a warehouse item
router.delete('/layout/:id', async (req, res) => {
  try {
    const item = await WarehouseItem.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: 'Cannot find item' });
    }

    await item.remove();
    res.json({ message: 'Deleted Item' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
