const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const logRoutes = require('../routes/logs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/logs', logRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Log CRUD operations', () => {
  let logId;

  test('POST /logs/add - Create a new log', async () => {
    const res = await request(app)
      .post('/logs/add')
      .send({
        user: 'testuser',
        action: 'login',
        comment: 'User logged in successfully'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('user', 'testuser');
    expect(res.body).toHaveProperty('action', 'login');
    expect(res.body).toHaveProperty('comment', 'User logged in successfully');
    expect(res.body).toHaveProperty('time');
    logId = res.body._id;
  });

  test('GET /logs - Get all logs', async () => {
    const res = await request(app).get('/logs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    // Check if logs are sorted by time in descending order
    expect(new Date(res.body[0].time) >= new Date(res.body[res.body.length - 1].time)).toBeTruthy();
  });

  test('GET /logs/:id - Get a specific log', async () => {
    const res = await request(app).get(`/logs/${logId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user', 'testuser');
    expect(res.body).toHaveProperty('action', 'login');
    expect(res.body).toHaveProperty('comment', 'User logged in successfully');
  });

  test('GET /logs/:id - Attempt to get non-existent log', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/logs/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});