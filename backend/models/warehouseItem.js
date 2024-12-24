const mongoose = require("mongoose");

const warehouseItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['wall', 'usableArea', 'nonUsableArea', 'stock'],
    required: true
  },
  size: {
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  position: {
    type: [Number],
    required: true,
    validate: [arrayLimit, '{PATH} must have exactly 3 elements']
  },
  quantity: {
    type: [Number],
    default: [1]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

function arrayLimit(val) {
  return val.length === 3;
}

module.exports = warehouseItemSchema;
