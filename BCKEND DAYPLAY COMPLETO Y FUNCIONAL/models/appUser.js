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
      AppUser.belongsTo(models.Person, { foreignKey: 'personId', onDelete: 'CASCADE' });
      AppUser.belongsTo(models.UserPlan, { foreignKey: 'planId', onDelete: 'CASCADE' });
      AppUser.hasMany(models.Leaderboard, {foreignKey: 'personId'});
    };
  
    return AppUser;
  };
  