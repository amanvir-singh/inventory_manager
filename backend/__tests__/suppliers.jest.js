const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const supplierRoutes = require('../routes/suppliers');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/suppliers', supplierRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Supplier CRUD operations', () => {
  let supplierId;

  test('POST /suppliers/add - Create a new supplier', async () => {
    const res = await request(app)
      .post('/suppliers/add')
      .send({
        name: 'Uniboard',
        code: 'UNI'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'Uniboard');
    expect(res.body).toHaveProperty('code', 'UNI');
    supplierId = res.body._id;
  });

  test('GET /suppliers - Get all suppliers', async () => {
    const res = await request(app).get('/suppliers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /suppliers/:id - Get a specific supplier', async () => {
    const res = await request(app).get(`/suppliers/${supplierId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Uniboard');
    expect(res.body).toHaveProperty('code', 'UNI');
  });

  test('PUT /suppliers/:id - Update a supplier', async () => {
    const res = await request(app)
      .put(`/suppliers/${supplierId}`)
      .send({ name: 'Uniboard Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Uniboard Updated');
  });

  test('DELETE /suppliers/:id - Delete a supplier', async () => {
    const res = await request(app).delete(`/suppliers/${supplierId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Supplier deleted');
  });

  test('GET /suppliers/:id - Attempt to get deleted supplier', async () => {
    const res = await request(app).get(`/suppliers/${supplierId}`);
    expect(res.statusCode).toBe(404);
  });
});