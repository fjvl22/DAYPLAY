const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserPlan = sequelize.define('UserPlan', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        planType: {
            type: DataTypes.ENUM('BASIC', 'PREMIUM'),
            allowNull: false,
            field: 'PLAN_TYPE'
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'PRICE'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'ACTIVE'
        },
        stripePriceId: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'STRIPE_PRICE_ID'
        }
    }, {
        tableName: 'USER_PLAN',
        timestamps: false
    });

    UserPlan.associate = (models) => {
        UserPlan.hasMany(models.UserPending, {
            foreignKey: 'planId',
            as: 'pendingUsers'
        });

        UserPlan.hasMany(models.AppUser, {
            foreignKey: 'planId',
            as: 'users'
        });

        UserPlan.hasMany(models.RegistrationPending, {
            foreignKey: 'planId',
            as: 'pendingRegistrations'
        });
    };

    return UserPlan;
};