module.exports = (sequelize, DataTypes) => {
    const TokenBlacklist = sequelize.define('TokenBlacklist', {
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'TOKEN'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'EXPIRES_AT'
        }
    }, {
        tableName: 'TOKEN_BLACKLIST',
        freezeTableName: true,

        timestamps: true,

        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT'
    });

    return TokenBlacklist;
};