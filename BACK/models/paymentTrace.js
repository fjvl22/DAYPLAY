module.exports = (sequelize, DataTypes) => {
    const PaymentTrace = sequelize.define('PaymentTrace', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      paymentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'PAYMENT_ID' },
      traceDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'TRACE_DATE' },
      action: { type: DataTypes.STRING(50), allowNull: false, field: 'ACTION' },
      notes: { type: DataTypes.TEXT, field: 'NOTES' },
      updatedBy: { type: DataTypes.INTEGER.UNSIGNED, field: 'UPDATED_BY' }
    }, {
      tableName: 'PAYMENT_TRACE',
      timestamps: false
    });

    PaymentTrace.associate = (models) => {
      PaymentTrace.belongsTo(models.Payment, { foreignKey: 'paymentId' });
      PaymentTrace.belongsTo(models.Admin, { foreignKey: 'updatedBy' });
    };
  
    return PaymentTrace;
  };