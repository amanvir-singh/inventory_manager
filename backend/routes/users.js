const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { schemas } = require('../createModels');

const users = mongoose.model('users', schemas.userSchema);


// Create
router.post('/add', async (req, res) => {
    try {
      const user = new users(req.body);
      await users.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


// Read all
router.get('/', async (req, res) => {
    try {
      const users = await users.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  

// Read one
router.get('/:id', async (req, res) => {
    try {
      const user = await users.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
// Update
router.put('/:id', async (req, res) => {
    try {
      const user = await users.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});
  
// Delete
router.delete('/:id', async (req, res) => {
    try {
      const user = await users.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
module.exports = router;