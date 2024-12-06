const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('../routes/users');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/users', userRoutes);

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected")
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User CRUD operations', () => {
  let userId;

  test('POST /users/add - Create a new user', async () => {
    const res = await request(app)
      .post('/users/add')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: 'Reader'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  test('GET /users - Get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /users/:id - Get a specific user', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });

  test('PUT /users/:id - Update a user', async () => {
    const res = await request(app)
      .put(`/users/${userId}`)
      .send({ username: 'updateduser' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'updateduser');
  });

  test('DELETE /users/:id - Delete a user', async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User deleted');
  });

  test('GET /users/:id - Attempt to get deleted user', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});