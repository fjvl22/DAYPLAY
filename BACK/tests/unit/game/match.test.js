const gameService = require('../../../modules/user/game.service');
const { GameMatch } = require('../../../models');

describe('GAME UNIT - MATCH', () => {

  test('should block second match same day', async () => {

    GameMatch.findOne = jest.fn().mockResolvedValue({
      id: 1
    });

    await expect(
      gameService.createMatch(1, 1)
    ).rejects.toThrow();
  });

  test('should create match', async () => {

    GameMatch.findOne = jest.fn().mockResolvedValue(null);
    GameMatch.create = jest.fn().mockResolvedValue({
      id: 1,
      userId: 1,
      gameId: 1,
      score: 0
    });

    const result = await gameService.createMatch(1, 1);

    expect(result).toHaveProperty('match');
  });

});