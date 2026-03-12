module.exports = (sequelize, DataTypes) => {
    const TokenBlacklist = sequelize.define('TokenBlacklist', {
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return TokenBlacklist;
};