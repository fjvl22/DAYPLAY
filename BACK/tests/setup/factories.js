const { Person, AppUser, Admin, Game } = require('../../models');
const bcrypt = require('bcryptjs');

module.exports = {

  async createUser() {
    const person = await Person.create({
      nickname: 'user1',
      email: 'user@test.com',
      passwordHash: await bcrypt.hash('1234', 10),
      personType: 'USER',
      active: true
    });

    return AppUser.create({
      personId: person.id,
      planId: 1
    });
  },

  async createAdmin(type = 'GAME_ADMIN') {
    const person = await Person.create({
      nickname: 'admin',
      email: 'admin@test.com',
      passwordHash: await bcrypt.hash('1234', 10),
      personType: 'ADMIN',
      active: true
    });

    return Admin.create({
      personId: person.id,
      adminType: type,
      department: 'GAME',
      permissions: {}
    });
  },

  async createGame() {
    return Game.create({
      name: 'Hangman',
      description: 'Test game',
      url: 'http://game.com'
    });
  }
};