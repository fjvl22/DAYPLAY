// models/payment.js
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
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'FAILED'),
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
      allowNull: true,
      field: 'TRANSACTION_ID'
    }
  }, {
    tableName: 'PAYMENT',
    timestamps: false
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.AppUser, { foreignKey: 'USER_ID' });
    Payment.hasMany(models.PaymentTrace, { foreignKey: 'PAYMENT_ID' });
  };

  return Payment;
};