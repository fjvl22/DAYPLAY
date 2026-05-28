module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('Leaderboard', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true, field: 'ID' },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'USER_ID' },
    gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'GAME_ID' },
    totalPoints: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'TOTAL_POINTS' },
    lastUpdate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'LAST_UPDATE' }
  }, {
    tableName: 'LEADERBOARD',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['USER_ID', 'GAME_ID']
      }
    ]
  });
  Leaderboard.associate = (models) => {
    Leaderboard.belongsTo(models.AppUser, { foreignKey: 'userId' });
    Leaderboard.belongsTo(models.Game, { foreignKey: 'gameId' });
  };
  return Leaderboard;
};