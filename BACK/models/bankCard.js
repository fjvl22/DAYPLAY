module.exports = (sequelize, DataTypes) => {
  const BankCard = sequelize.define('BankCard', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'ID'
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: 'TOKEN'
    },
    last4: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      field: 'LAST4'
    },
    brand: {
      type: DataTypes.STRING(30),
      field: 'BRAND'
    },
    bin: {
      type: DataTypes.STRING(8),
      field: 'BIN'
    },
    expiryMonth: {
      type: DataTypes.TINYINT,
      field: 'EXPIRY_MONTH'
    },
    expiryYear: {
      type: DataTypes.SMALLINT,
      field: 'EXPIRY_YEAR'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'IS_ACTIVE'
    },
    bankEntityId: {
      type: DataTypes.INTEGER.UNSIGNED,
      field: 'BANK_ENTITY_ID'
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'USER_ID'
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'CREATION_DATE'
    },
    stripePaymentMethodId: {
      type: DataTypes.STRING(100),
      field: 'STRIPE_PAYMENT_METHOD_ID'
    }
  }, {
    tableName: 'bank_card',
    timestamps: false
  });

  BankCard.associate = (models) => {
    BankCard.belongsTo(models.BankEntity, { foreignKey: 'bankEntityId' });
    BankCard.belongsTo(models.AppUser, { foreignKey: 'userId' });
  };

  return BankCard;
};