const bcrypt = require('bcryptjs');
const { Person, AppUser, Admin, Game, UserPlan } = require('../../models');

async function seedDatabase() {

  // Plans
  const basicPlan = await UserPlan.create({
    planType: 'BASIC',
    price: 10,
    active: 1
  });

  const premiumPlan = await UserPlan.create({
    planType: 'PREMIUM',
    price: 15,
    active: 1
  });

  // User
  const userPerson = await Person.create({
    nickname: 'user1',
    email: 'user@test.com',
    passwordHash: await bcrypt.hash('1234', 10),
    personType: 'USER',
    active: true
  });

  await AppUser.create({
    personId: userPerson.id,
    planId: basicPlan.id
  });

  // Admin
  const adminPerson = await Person.create({
    nickname: 'admin',
    email: 'admin@test.com',
    passwordHash: await bcrypt.hash('1234', 10),
    personType: 'ADMIN',
    active: true
  });

  await Admin.create({
    personId: adminPerson.id,
    adminType: 'GAME_ADMIN',
    department: 'GAME',
    permissions: {
      canManageGames: true
    }
  });

  // Games
  await Game.bulkCreate([
    { name: 'Hangman', description: 'Game 1', url: 'url1' },
    { name: 'Wordle', description: 'Game 2', url: 'url2' },
    { name: 'Math', description: 'Game 3', url: 'url3' },
    { name: 'Story', description: 'Game 4', url: 'url4' }
  ]);

}

module.exports = { seedDatabase };