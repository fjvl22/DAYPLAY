const request = require('supertest');
const app = require('../../server');
const { createUser, createGame } = require('../setup/factories');

describe('FULL E2E FLOW', () => {

  beforeAll(async () => {
    await createUser();
    await createGame();
  });

  test('user complete lifecycle', async () => {

    // LOGIN
    const login = await request(app)
      .post('/api/auth/login')
      .send({
        nickname: 'user1',
        password: '1234'
      });

    const token = login.body.accessToken;

    expect(token).toBeDefined();

    // CREATE MATCH
    const match = await request(app)
      .post('/api/user/match')
      .set('Authorization', `Bearer ${token}`)
      .send({ gameId: 1 });

    expect(match.statusCode).toBe(200);

    const matchId = match.body.match.id;

    // FINISH MATCH
    const finish = await request(app)
      .post('/api/user/match/finish')
      .set('Authorization', `Bearer ${token}`)
      .send({
        matchId,
        score: 10,
        extraData: {}
      });

    expect(finish.statusCode).toBe(200);

  });

});