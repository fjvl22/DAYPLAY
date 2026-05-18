const request = require('supertest');
const app = require('../../server');
const { createUser, createGame } = require('../setup/factories');

describe('REWARDS INTEGRATION TESTS', () => {

  let token;

  beforeAll(async () => {
    await createUser();
    await createGame();

    const login = await request(app)
      .post('/api/auth/login')
      .send({
        nickname: 'user1',
        password: '1234'
      });

    token = login.body.accessToken;
  });

  test('should create match', async () => {

    const res = await request(app)
      .post('/api/user/match')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('match');
  });

  test('should finish match', async () => {

    const match = await request(app)
      .post('/api/user/match')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 1 });

    const matchId = match.body.match.id;

    const res = await request(app)
      .post('/api/user/match/finish')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId,
        score: 10,
        extraData: {}
      });

    expect(res.statusCode).toBe(200);
  });

});