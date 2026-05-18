const gameService = require('../../../modules/user/game.service');
const { Streak } = require('../../../models');

describe('GAME UNIT - STREAK', () => {

  test('should create new streak if not exists', async () => {

    Streak.findOne = jest.fn().mockResolvedValue(null);
    Streak.create = jest.fn().mockResolvedValue({
      currentStreak: 1
    });

    const result = await gameService.updateStreak(1, 1);

    expect(result.currentStreak).toBeDefined();
  });

});