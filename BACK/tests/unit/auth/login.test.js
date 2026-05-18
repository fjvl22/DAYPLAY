const authService = require('../../../modules/auth/auth.service');
const { Person } = require('../../../models');
const bcrypt = require('bcryptjs');

describe('AUTH UNIT - LOGIN', () => {

  test('should throw if user not found', async () => {

    Person.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      authService.login('no-user', '1234', false)
    ).rejects.toThrow('User not found');
  });

  test('should login successfully', async () => {

    const fakeUser = {
      id: 1,
      nickname: 'user1',
      passwordHash: await bcrypt.hash('1234', 10),
      personType: 'USER',
      active: true,
      AppUser: { planId: 1 },
      Admin: null,
      UserPending: null
    };

    Person.findOne = jest.fn().mockResolvedValue(fakeUser);

    const result = await authService.login('user1', '1234', false);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

});