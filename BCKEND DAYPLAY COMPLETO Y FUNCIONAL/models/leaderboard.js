module.exports = (sequelize, DataTypes) => {
  const Leaderboard = sequelize.define('Leaderboard', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    totalPoints: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    lastUpdate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'LEADERBOARD',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'gameId']
      }
    ]
  });
  return Leaderboard;
};