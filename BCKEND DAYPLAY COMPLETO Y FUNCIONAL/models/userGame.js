// models/userGame.js
module.exports = (sequelize, DataTypes) => {
    const UserGame = sequelize.define('UserGame', {
      userId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      active: { type: DataTypes.BOOLEAN, defaultValue: true }
    }, {
      tableName: 'USER_GAME',
      timestamps: false
    });
  
    UserGame.associate = (models) => {
      UserGame.belongsTo(models.AppUser, { foreignKey: 'userId' });
      UserGame.belongsTo(models.Game, { foreignKey: 'gameId' });
    };
  
    return UserGame;
  };
  