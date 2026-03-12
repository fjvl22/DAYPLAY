// models/paymentTrace.js
module.exports = (sequelize, DataTypes) => {
    const PaymentTrace = sequelize.define('PaymentTrace', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      paymentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      traceDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      action: { type: DataTypes.STRING(50), allowNull: false },
      notes: DataTypes.TEXT,
      updatedBy: DataTypes.INTEGER.UNSIGNED
    }, {
      tableName: 'PAYMENT_TRACE',
      timestamps: false
    });
  
    PaymentTrace.associate = (models) => {
      PaymentTrace.belongsTo(models.Payment, { foreignKey: 'paymentId', onDelete: 'CASCADE' });
      PaymentTrace.belongsTo(models.Admin, { foreignKey: 'updatedBy' });
    };
  
    return PaymentTrace;
  };
  