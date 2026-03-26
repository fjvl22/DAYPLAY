// models/dailyGameReward.js
module.exports = (sequelize, DataTypes) => {
    const DailyGameReward = sequelize.define('DailyGameReward', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      rewardDate: { type: DataTypes.DATEONLY, allowNull: false },
      totalScore: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'DAILY_GAME_REWARD',
      timestamps: false,
      indexes: [{ unique: true, fields: ['userId','rewardDate'] }]
    });
  
    DailyGameReward.associate = (models) => {
      DailyGameReward.belongsTo(models.AppUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return DailyGameReward;
  };
  