const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const materialRoutes = require('../routes/materials');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/materials', materialRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Material CRUD operations', () => {
  let materialId;

  test('POST /materials/add - Create a new material', async () => {
    const res = await request(app)
      .post('/materials/add')
      .send({
        code: 'U_555_D_1',
        name: 'White',
        length: 109,
        width: 61,
        supplier: 'Uniboard',
        finish: 'Dolomite',
        qty: 54,
        location: [['3A3', '4G6']],
        qty_per_location: [18,36]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    materialId = res.body._id;
  });

  test('GET /materials - Get all materials', async () => {
    const res = await request(app).get('/materials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /materials/:id - Get a specific material', async () => {
    const res = await request(app).get(`/materials/${materialId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('code', 'U_555_D_1');
  });

  test('PUT /materials/:id - Update a material', async () => {
    const res = await request(app)
      .put(`/materials/${materialId}`)
      .send({ name: 'Updated Material' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Material');
  });

  test('DELETE /materials/:id - Delete a material', async () => {
    const res = await request(app).delete(`/materials/${materialId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Material deleted');
  });

  test('GET /materials/:id - Attempt to get deleted material', async () => {
    const res = await request(app).get(`/materials/${materialId}`);
    expect(res.statusCode).toBe(404);
  });
});