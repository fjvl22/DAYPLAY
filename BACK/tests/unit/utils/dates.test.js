const { getToday, getYesterday } = require('../../../modules/user/game.service');

describe('UTILS UNIT - DATES', () => {

  test('should return valid today date', () => {
    const today = getToday();
    expect(today instanceof Date).toBe(true);
  });

  test('yesterday should be before today', () => {
    const today = getToday();
    const yesterday = getYesterday();

    expect(yesterday.getTime()).toBeLessThan(today.getTime());
  });

});