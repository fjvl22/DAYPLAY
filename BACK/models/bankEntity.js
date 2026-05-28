module.exports = (sequelize, DataTypes) => {
    const BankEntity = sequelize.define('BankEntity', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      name: { type: DataTypes.STRING(100), allowNull: false, field: 'NAME' },
      entityCode: { type: DataTypes.STRING(10), allowNull: false, unique: true, field: 'ENTITY_CODE' },
      address: { type: DataTypes.STRING(255), field: 'ADDRESS' },
      phone: { type: DataTypes.STRING(20), field: 'PHONE' },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATION_DATE' }
    }, {
      tableName: 'BANK_ENTITY',
      timestamps: false
    });

    BankEntity.associate = (models) => {
      BankEntity.hasMany(models.BankCard, { foreignKey: 'bankEntityId' });
    };
  
    return BankEntity;
  };