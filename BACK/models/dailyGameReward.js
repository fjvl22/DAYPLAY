module.exports = (sequelize, DataTypes) => {
    const DailyGameReward = sequelize.define('DailyGameReward', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'USER_ID' },
      rewardDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'REWARD_DATE' },
      totalScore: { type: DataTypes.INTEGER, allowNull: false, field: 'TOTAL_SCORE' },
      createdAt: { type: DataTypes.DATE, field: 'CREATED_AT' }
    }, {
      tableName: 'DAILY_GAME_REWARD',
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: false,
      indexes: [{ unique: true, name: 'uniq_user_reward_date', fields: ['USER_ID','REWARD_DATE'] }]
    });

    DailyGameReward.associate = (models) => {
      DailyGameReward.belongsTo(models.AppUser, { foreignKey: 'userId' });
    };
  
    return DailyGameReward;
  };