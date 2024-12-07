const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const thicknessRoutes = require('../routes/thicknessnes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/thicknesses', thicknessRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Thickness CRUD operations', () => {
  let thicknessId;

  test('POST /thicknesses/add - Create a new thickness', async () => {
    const res = await request(app)
      .post('/thicknesses/add')
      .send({
        name: '5/8',
        code: '.625'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', '5/8');
    expect(res.body).toHaveProperty('code', '.625');
    thicknessId = res.body._id;
  });

  test('GET /thicknesses - Get all thicknesses', async () => {
    const res = await request(app).get('/thicknesses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /thicknesses/:id - Get a specific thickness', async () => {
    const res = await request(app).get(`/thicknesses/${thicknessId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', '5/8');
    expect(res.body).toHaveProperty('code', '.625');
  });

  test('PUT /thicknesses/:id - Update a thickness', async () => {
    const res = await request(app)
      .put(`/thicknesses/${thicknessId}`)
      .send({ name: '11/16' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', '11/16');
  });

  test('DELETE /thicknesses/:id - Delete a thickness', async () => {
    const res = await request(app).delete(`/thicknesses/${thicknessId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Thickness deleted');
  });

  test('GET /thicknesses/:id - Attempt to get deleted thickness', async () => {
    const res = await request(app).get(`/thicknesses/${thicknessId}`);
    expect(res.statusCode).toBe(404);
  });
});