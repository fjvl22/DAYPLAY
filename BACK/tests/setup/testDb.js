const sequelize = require('../../config/database');

async function initTestDb() {
  await sequelize.sync({ force: true });
}

async function closeDb() {
  await sequelize.close();
}

module.exports = { initTestDb, closeDb };