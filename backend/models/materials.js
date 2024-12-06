const mongoose = require("mongoose");


const materialSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    supplier: {
      type: String,
      required: true,
    },
    finish: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    location: {
      type: [[String]],
    },
    qty_per_location: {
      type: [Number],
    },
});
  

module.exports = materialSchema;