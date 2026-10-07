const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Streak = sequelize.define('Streak', {
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
        gameId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'GAME_ID'
        },
        currentStreak: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'CURRENT_STREAK'
        },
        lastDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'LAST_DATE'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'UPDATED_AT'
        }
    }, {
        tableName: 'STREAK',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['USER_ID', 'GAME_ID']
            }
        ]
    });

    Streak.associate = (models) => {
        Streak.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });

        Streak.belongsTo(models.Game, {
            foreignKey: 'gameId',
            as: 'game'
        });
    };

    return Streak;
};