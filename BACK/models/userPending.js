module.exports = (sequelize, DataTypes) => {
    const UserPending = sequelize.define('UserPending', {
      personId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, field: 'PERSON_ID' }
    }, {
      tableName: 'USER_PENDING',
      timestamps: false
    });

    UserPending.associate = (models) => {
        UserPending.belongsTo(models.Person, {
            foreignKey: 'personId'
        });
    };
  
    return UserPending;
  };