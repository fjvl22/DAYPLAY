const authService = require('../../../modules/auth/auth.service');
const bcrypt = require('bcryptjs');
const { Person } = require('../../../models');

describe('AUTH UNIT - PASSWORD', () => {

  test('should reject wrong current password', async () => {

    Person.findOne = jest.fn().mockResolvedValue({
      id: 1,
      passwordHash: 'hashed',
    });

    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await expect(
      authService.changePassword(1, 'wrong', 'newpass')
    ).rejects.toThrow('Current password is incorrect');
  });

});