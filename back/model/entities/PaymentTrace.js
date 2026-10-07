const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PaymentTrace = sequelize.define('PaymentTrace', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        paymentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'PAYMENT_ID'
        },
        traceDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'TRACE_DATE'
        },
        action: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'ACTION'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'NOTES'
        },
        updatedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'UPDATED_BY'
        }
    }, {
        tableName: 'PAYMENT_TRACE',
        timestamps: false
    });

    PaymentTrace.associate = (models) => {
        PaymentTrace.belongsTo(models.Payment, {
            foreignKey: 'paymentId',
            as: 'payment'
        });

        PaymentTrace.belongsTo(models.Admin, {
            foreignKey: 'updatedBy',
            as: 'updatedByAdmin'
        });
    };

    return PaymentTrace;
};