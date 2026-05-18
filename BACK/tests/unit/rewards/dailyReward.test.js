const { DailyGameReward, GameMatch } = require('../../../models');
const { approveDailyReward } = require('../../../modules/admin/admin.service');

describe('DAILY REWARD REAL LOGIC', () => {

  test('should reject reward if no matches', async () => {

    GameMatch.count = jest.fn().mockResolvedValue(0);
    DailyGameReward.findOne = jest.fn().mockResolvedValue({
      userId: 1
    });

    const result = await approveDailyReward(1, 1);

    expect(result.approved).toBe(false);
  });

});