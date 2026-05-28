module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      field: 'ID'
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'USER_ID'
    },
    amount: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
      field: 'AMOUNT'
    },
    status: {
      type: DataTypes.ENUM(
        'PENDING',
        'PROCESSING',
        'CONFIRMED',
        'FAILED',
        'CANCELED',
        'REFUNDED'
      ),
      allowNull: false,
      field: 'STATUS'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'DATE'
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'PAYMENT_METHOD'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      field: 'TRANSACTION_ID'
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING(100),
      unique: true,
      field: 'STRIPE_PAYMENT_INTENT_ID'
    },
    failureReason: {
      type: DataTypes.TEXT,
      field: 'FAILURE_REASON'
    },
    confirmedAt: {
      type: DataTypes.DATE,
      field: 'CONFIRMED_AT'
    },
    currency: {
      type: DataTypes.CHAR(3),
      defaultValue: 'EUR',
      field: 'CURRENCY'
    }
  }, {
    tableName: 'payment',
    timestamps: false
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.AppUser, { foreignKey: 'userId' });
    Payment.hasMany(models.PaymentTrace, { foreignKey: 'paymentId' });
  };

  return Payment;
};