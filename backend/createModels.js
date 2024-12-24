const mongoose = require("mongoose");

const userSchema = require('./models/users');
const materialSchema = require('./models/materials');
const supplierSchema = require('./models/suppliers');
const finishesSchema = require('./models/finishes');
const thicknessSchema = require('./models/thicknesses');
const logSchema = require('./models/logs');
const warehouseItemSchema = require('./models/warehouseItem');



function initializeModels() {
    console.log("Checking for Models...")
    const models = {
      users: { name: 'users', schema: userSchema },
      materials: { name: 'materials', schema: materialSchema },
      suppliers: { name: 'suppliers', schema: supplierSchema },
      finishes: { name: 'finishes', schema: finishesSchema },
      thicknesses: { name: 'thicknesses', schema: thicknessSchema },
      logs: { name: 'logs', schema: logSchema },
      warehouseItem: {name: 'warehouseItem', schema: warehouseItemSchema}
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
      Log: models.logs.model,
      WarehouseItem: models.warehouseItem.model 
    };
  }

  module.exports = {
    initializeModels,
    schemas: {
      userSchema,
      materialSchema,
      supplierSchema,
      finishesSchema,
      thicknessSchema,
      logSchema,
      warehouseItemSchema  
    }
  };
