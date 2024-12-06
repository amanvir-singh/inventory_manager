const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "Editor", "Manager", "Stock Officer", "Reader"],
    default: "Reader",
  },
});

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
});

const finishesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
        unique: true,
      },
});

const thicknessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      code: {
        type: String,
        required: true,
        unique: true,
      },
});

const logSchema = new mongoose.Schema({
    user: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: false 
    },
    time: {
      type: Date,
      default: Date.now 
    }
  });

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


function initializeModels() {
    console.log("Checking for Models...")
    const models = {
      users: { name: 'users', schema: userSchema },
      materials: { name: 'materials', schema: materialSchema },
      suppliers: { name: 'suppliers', schema: supplierSchema },
      finishes: { name: 'finishes', schema: finishesSchema },
      thicknesses: { name: 'thicknesses', schema: thicknessSchema },
      logs: { name: 'logs', schema: logSchema }
    };
  
    Object.entries(models).forEach(([key, { name, schema }]) => {
      if (mongoose.models[name]) {
        console.log(`Model ${name} exists`);
        models[key].model = mongoose.model(name);
      } else {
        console.log(`Model ${name} created`);
        models[key].model = mongoose.model(name, schema);
      }
    });
  
    return {
      User: models.users.model,
      Material: models.materials.model,
      Supplier: models.suppliers.model,
      Finish: models.finishes.model,
      Thickness: models.thicknesses.model,
      Log: models.logs.model
    };
  }

module.exports = initializeModels;
