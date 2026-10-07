const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Game = sequelize.define('Game', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'NAME'
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'DESCRIPTION'
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            field: 'URL'
        }
    }, {
        tableName: 'GAME',
        timestamps: false
    });

    Game.associate = (models) => {
        Game.hasMany(models.GameWord, {
            foreignKey: 'gameId',
            as: 'words'
        });

        Game.hasMany(models.GameMatch, {
            foreignKey: 'gameId',
            as: 'matches'
        });

        Game.hasMany(models.Streak, {
            foreignKey: 'gameId',
            as: 'streaks'
        });

        Game.hasMany(models.Leaderboard, {
            foreignKey: 'gameId',
            as: 'leaderboards'
        });

        Game.hasMany(models.UserGame, {
            foreignKey: 'gameId',
            as: 'userGames'
        });

        Game.hasMany(models.MathOperation, {
            foreignKey: 'gameId',
            as: 'mathOperations'
        });
    };

    return Game;
};