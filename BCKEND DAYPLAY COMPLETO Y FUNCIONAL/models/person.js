// models/person.js
module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      nickname: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      passwordHash: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      registrationDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      personType: { type: DataTypes.ENUM('USER','ADMIN'), allowNull: false }
    }, {
      tableName: 'PERSON',
      timestamps: false
    });

    Person.associate = (models) => {
      Person.hasOne(models.AppUser, { foreignKey: 'PERSON_ID' });
      Person.hasOne(models.Admin, { foreignKey: 'PERSON_ID' });
      Person.hasOne(models.UserPending, { foreignKey: 'PERSON_ID' });
    };
  
    return Person;
  };
  