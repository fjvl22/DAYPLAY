const request = require('supertest');
const app = require('../../server');
const { Person } = require('../../models');
const bcrypt = require('bcryptjs');

describe('AUTH INTEGRATION TESTS', () => {

  beforeAll(async () => {
    await Person.create({
      nickname: 'testuser',
      email: 'test@test.com',
      passwordHash: await bcrypt.hash('1234', 10),
      personType: 'USER',
      active: true
    });
  });

  test('should login successfully', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        nickname: 'testuser',
        password: '1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  test('should fail login with wrong password', async () => {

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        nickname: 'testuser',
        password: 'wrong'
      });

    expect(res.statusCode).toBe(500);
  });

});