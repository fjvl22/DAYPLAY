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
  
    return UserPlan;
  };
  