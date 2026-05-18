const request = require('supertest');
const app = require('../../server');
const { createAdmin } = require('../setup/factories');

describe('ADMIN INTEGRATION TESTS', () => {

  let admin;

  beforeAll(async () => {
    admin = await createAdmin('GAME_ADMIN');
  });

  test('should get users (admin)', async () => {

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer TEST_ADMIN_TOKEN`);

    expect(res.statusCode).toBe(200);
  });

  test('should get games', async () => {

    const res = await request(app)
      .get('/api/admin/games')
      .set('Authorization', `Bearer TEST_ADMIN_TOKEN`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should get system events', async () => {

    const res = await request(app)
      .get('/api/admin/events')
      .set('Authorization', `Bearer TEST_ADMIN_TOKEN`);

    expect(res.statusCode).toBe(200);
  });

});