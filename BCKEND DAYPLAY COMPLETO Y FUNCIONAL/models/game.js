// models/game.js
module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false, unique: true }
    }, {
      tableName: 'GAME',
      timestamps: false
    });

    Game.associate = (models) => {
      Game.hasMany(models.GameWord, { foreignKey: 'GAME_ID' });
      Game.hasMany(models.MathOperation, { foreignKey: 'GAME_ID' });
      Game.hasMany(models.GameMatch, { foreignKey: 'GAME_ID' });
      Game.hasMany(models.Streak, { foreignKey: 'GAME_ID' });
      Game.hasMany(models.Leaderboard, { foreignKey: 'GAME_ID' });
  
      Game.belongsToMany(models.AppUser, {
          through: models.UserGame,
          foreignKey: 'GAME_ID'
      });
    };
  
    return Game;
  };
  