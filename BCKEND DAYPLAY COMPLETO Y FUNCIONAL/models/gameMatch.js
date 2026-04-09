// models/gameMatch.js
module.exports = (sequelize, DataTypes) => {
    const GameMatch = sequelize.define('GameMatch', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      score: { type: DataTypes.INTEGER, allowNull: false },
      extraData: { type: DataTypes.JSON }
    }, {
      tableName: 'GAME_MATCH',
      timestamps: false
    });

    GameMatch.associate = (models) => {
      GameMatch.belongsTo(models.AppUser, { foreignKey: 'USER_ID' });
      GameMatch.belongsTo(models.Game, { foreignKey: 'GAME_ID' });
    };
  
    return GameMatch;
  };
  