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
      indexes: [{ unique: true, name: 'uniq_user_reward_date', fields: ['USER_ID','REWARD_DATE'] }]
    });

    DailyGameReward.associate = (models) => {
      DailyGameReward.belongsTo(models.AppUser, { foreignKey: 'USER_ID' });
    };
  
    return DailyGameReward;
  };
  