const request = require('supertest');
const app = require('../../server'); 
const { createUser, createGame } = require('../setup/factories');

describe('GAME FLOW INTEGRATION', () => {

  let user;

  beforeAll(async () => {
    user = await createUser();
    await createGame();
  });

  test('full match flow works', async () => {

    const matchRes = await request(app)
      .post('/api/user/match')
      .set('Authorization', `Bearer FAKE_TOKEN_FOR_TEST`)
      .send({ gameId: 1 });

    expect(matchRes.statusCode).toBe(200);

    const matchId = matchRes.body.match.id;

    const finishRes = await request(app)
      .post('/api/user/match/finish')
      .send({
        matchId,
        score: 10,
        extraData: {}
      });

    expect(finishRes.statusCode).toBe(200);
  });

});