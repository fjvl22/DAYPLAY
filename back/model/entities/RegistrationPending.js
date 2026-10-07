const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RegistrationPending = sequelize.define('RegistrationPending', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'NICKNAME'
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'PASSWORD_HASH'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'EMAIL'
        },
        planId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'PLAN_ID'
        },
        tokenHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            field: 'TOKEN_HASH'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'EXPIRES_AT'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'CREATED_AT'
        }
    }, {
        tableName: 'REGISTRATION_PENDING',
        timestamps: false
    });

    RegistrationPending.associate = (models) => {
        RegistrationPending.belongsTo(models.UserPlan, {
            foreignKey: 'planId',
            as: 'plan'
        });
    };

    return RegistrationPending;
};