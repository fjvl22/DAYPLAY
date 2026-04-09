// models/userPending.js
module.exports = (sequelize, DataTypes) => {
    const UserPending = sequelize.define('UserPending', {
      personId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true }
    }, {
      tableName: 'USER_PENDING',
      timestamps: false
    });

    UserPending.associate = (models) => {
      UserPending.belongsTo(models.Person, { foreignKey: 'PERSON_ID' });
    };
  
    return UserPending;
  };
  