module.exports = (sequelize, DataTypes) => {

  const AppUser = sequelize.define('AppUser', {

    personId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: 'PERSON_ID'
    },

    subscriptionDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'SUBSCRIPTION_DATE'
    },

    planId: {
      type: DataTypes.INTEGER.UNSIGNED,
      field: 'PLAN_ID'
    },

    stripeCustomerId: {
      type: DataTypes.STRING(100),
      field: 'STRIPE_CUSTOMER_ID'
    },

    subscriptionStatus: {
      type: DataTypes.ENUM('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED'),
      defaultValue: 'NONE',
      field: 'SUBSCRIPTION_STATUS'
    }

  }, {
    tableName: 'app_user',
    timestamps: false
  });

  AppUser.associate = (models) => {

    AppUser.belongsTo(models.Person, {
      foreignKey: 'personId',
      targetKey: 'id'
    });

    AppUser.belongsTo(models.UserPlan, {
      foreignKey: 'planId',
      targetKey: 'id'
    });

    AppUser.hasMany(models.SystemEvent, {
      foreignKey: 'actorId',
      sourceKey: 'personId',
      constraints: false,
      scope: { actorType: 'USER' }
    });
  };

  return AppUser;
};