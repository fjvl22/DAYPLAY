const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const GameMatch = sequelize.define('GameMatch', {
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
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'DATE'
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'SCORE'
        },
        extraData: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'EXTRA_DATA'
        }
    }, {
        tableName: 'GAME_MATCH',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['USER_ID', 'GAME_ID', 'DATE']
            }
        ]
    });

    GameMatch.associate = (models) => {
        GameMatch.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });

        GameMatch.belongsTo(models.Game, {
            foreignKey: 'gameId',
            as: 'game'
        });
    };

    return GameMatch;
};