// models/appUser.js
module.exports = (sequelize, DataTypes) => {
    const AppUser = sequelize.define('AppUser', {
      personId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      subscriptionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      planId: { type: DataTypes.INTEGER.UNSIGNED }
    }, {
      tableName: 'APP_USER',
      timestamps: false
    });

    AppUser.associate = (models) => {
      AppUser.belongsTo(models.Person, { foreignKey: 'PERSON_ID' });
      AppUser.belongsTo(models.UserPlan, { foreignKey: 'PLAN_ID' });
  
      AppUser.hasMany(models.BankCard, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.GameMatch, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.DailyGameReward, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.Streak, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.Leaderboard, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.Payment, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.Notification, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.SystemEvent, { foreignKey: 'USER_ID' });
      AppUser.hasMany(models.StoryAccess, { foreignKey: 'USER_ID' });
  
      AppUser.belongsToMany(models.Game, {
          through: models.UserGame,
          foreignKey: 'USER_ID'
      });
    };
  
    return AppUser;
  };
  