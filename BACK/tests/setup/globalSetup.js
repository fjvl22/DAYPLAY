const { initTestDb } = require('./testDb');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await initTestDb();
});

afterAll(async () => {
  const sequelize = require('../../config/database');
  await sequelize.close();
});