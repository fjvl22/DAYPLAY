module.exports = (sequelize, DataTypes) => {
    const UserGame = sequelize.define('UserGame', {
      userId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, field: 'USER_ID' },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, field: 'GAME_ID' },
      active: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'ACTIVE' }
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