const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'USER_ID'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
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
            allowNull: true,
            field: 'PAYMENT_METHOD'
        },
        transactionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'TRANSACTION_ID'
        },
        stripePaymentIntentId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
            field: 'STRIPE_PAYMENT_INTENT_ID'
        },
        failureReason: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'FAILURE_REASON'
        },
        confirmedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'CONFIRMED_AT'
        },
        currency: {
            type: DataTypes.CHAR(3),
            allowNull: false,
            defaultValue: 'EUR',
            field: 'CURRENCY'
        },
        stripeSessionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
            field: 'STRIPE_SESSION_ID'
        },
        stripeSubscriptionId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'STRIPE_SUBSCRIPTION_ID'
        }
    }, {
        tableName: 'PAYMENT',
        timestamps: false
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });

        Payment.hasMany(models.PaymentTrace, {
            foreignKey: 'paymentId',
            as: 'traces'
        });
    };

    return Payment;
};