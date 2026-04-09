// models/userPlan.js
module.exports = (sequelize, DataTypes) => {
  const UserPlan = sequelize.define('UserPlan', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    planType: { type: DataTypes.ENUM('BASIC', 'PREMIUM'), allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'USER_PLAN',
    timestamps: false
  });
  
  UserPlan.getPlanTypes = function () {
    return this.rawAttributes.planType.values;
  };

  UserPlan.associate = (models) => {
    UserPlan.hasMany(models.AppUser, { foreignKey: 'PLAN_ID' });
  };

  return UserPlan;
};