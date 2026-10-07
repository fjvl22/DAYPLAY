const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TokenBlacklist = sequelize.define('TokenBlacklist', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'TOKEN'
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
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'UPDATED_AT'
        }
    }, {
        tableName: 'TOKEN_BLACKLIST',
        timestamps: false
    });

    return TokenBlacklist;
};