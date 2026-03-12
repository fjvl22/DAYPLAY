// models/streak.js
module.exports = (sequelize, DataTypes) => {
    const Streak = sequelize.define('Streak', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      currentStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
      lastDate: { type: DataTypes.DATEONLY, allowNull: false },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'STREAK',
      timestamps: false,
      indexes: [{ unique: true, fields: ['userId','gameId'] }]
    });
  
    Streak.associate = (models) => {
      Streak.belongsTo(models.AppUser, { foreignKey: 'userId' });
      Streak.belongsTo(models.Game, { foreignKey: 'gameId' });
    };
  
    return Streak;
  };
  