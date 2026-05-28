module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define('Game', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      name: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'NAME' },
      description: { type: DataTypes.STRING(255), allowNull: false, field: 'DESCRIPTION' },
      url: { type: DataTypes.STRING(255), allowNull: false, unique: true, field: 'URL' }
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
  
      Game.belongsToMany(models.AppUser, {
          through: models.UserGame,
          foreignKey: 'gameId'
      });
    };
  
    return Game;
  };