// models/game.js
module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.STRING(255), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      type: { type: DataTypes.STRING(20), allowNull: false },
      config: { type: DataTypes.JSON },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
    }, {
      tableName: 'GAME',
      timestamps: false
    });
  
    Game.associate = (models) => {
      Game.hasMany(models.GameWord, { foreignKey: 'gameId' });
      Game.hasMany(models.MathOperation, { foreignKey: 'gameId' });
      Game.hasMany(models.GameMatch, { foreignKey: 'gameId' });
      Game.hasMany(models.Streak, { foreignKey: 'gameId' });
      Game.hasMany(models.Leaderboard, { foreignKey: 'gameId' });
      Game.hasMany(models.UserGame, { foreignKey: 'gameId' });
    };
  
    return Game;
  };
  