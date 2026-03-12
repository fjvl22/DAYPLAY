// models/bankEntity.js
module.exports = (sequelize, DataTypes) => {
    const BankEntity = sequelize.define('BankEntity', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      entityCode: { type: DataTypes.STRING(10), allowNull: false, unique: true },
      address: DataTypes.STRING(255),
      phone: DataTypes.STRING(20),
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'BANK_ENTITY',
      timestamps: false
    });
  
    return BankEntity;
  };
  