const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const finishRoutes = require('../routes/finishes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/finishes', finishRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Finish CRUD operations', () => {
  let finishId;

  test('POST /finishes/add - Create a new finish', async () => {
    const res = await request(app)
      .post('/finishes/add')
      .send({
        name: 'Super Matte',
        code: 'SM'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    finishId = res.body._id;
  });

  test('GET /finishes - Get all finishes', async () => {
    const res = await request(app).get('/finishes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /finishes/:id - Get a specific finish', async () => {
    const res = await request(app).get(`/finishes/${finishId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Super Matte');
    expect(res.body).toHaveProperty('code', 'SM');
  });

  test('PUT /finishes/:id - Update a finish', async () => {
    const res = await request(app)
      .put(`/finishes/${finishId}`)
      .send({ name: 'Dolomite' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Dolomite');
  });

  test('DELETE /finishes/:id - Delete a finish', async () => {
    const res = await request(app).delete(`/finishes/${finishId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Finish deleted');
  });

  test('GET /finishes/:id - Attempt to get deleted finish', async () => {
    const res = await request(app).get(`/finishes/${finishId}`);
    expect(res.statusCode).toBe(404);
  });
});