module.exports = (sequelize, DataTypes) => {
  const UserPlan = sequelize.define('UserPlan', {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
    planType: { type: DataTypes.ENUM('BASIC', 'PREMIUM'), allowNull: false, field: 'PLAN_TYPE' },
    active: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'ACTIVE' }
  }, {
    tableName: 'USER_PLAN',
    timestamps: false
  });
  
  UserPlan.getPlanTypes = function () {
    return this.rawAttributes.planType.values;
  };

  UserPlan.associate = (models) => {
    UserPlan.hasMany(models.AppUser, { foreignKey: 'planId' });
  };

  return UserPlan;
};