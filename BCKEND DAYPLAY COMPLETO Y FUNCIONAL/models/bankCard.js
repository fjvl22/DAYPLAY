// models/bankCard.js
module.exports = (sequelize, DataTypes) => {
    const BankCard = sequelize.define('BankCard', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      last4: { type: DataTypes.CHAR(4), allowNull: false },
      brand: DataTypes.STRING(30),
      bin: DataTypes.STRING(8),
      expiryMonth: DataTypes.TINYINT,
      expiryYear: DataTypes.SMALLINT,
      approxBalance: DataTypes.DECIMAL(10,2),
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      bankEntityId: DataTypes.INTEGER.UNSIGNED,
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'BANK_CARD',
      timestamps: false
    });
  
    BankCard.associate = (models) => {
      BankCard.belongsTo(models.BankEntity, { foreignKey: 'bankEntityId' });
      BankCard.belongsTo(models.AppUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return BankCard;
  };
  