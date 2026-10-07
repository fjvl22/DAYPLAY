const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const MathOperation = sequelize.define('MathOperation', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        operation: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'OPERATION'
        },
        result: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'RESULT'
        },
        gameId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'GAME_ID'
        }
    }, {
        tableName: 'MATH_OPERATION',
        timestamps: false
    });

    MathOperation.associate = (models) => {
        MathOperation.belongsTo(models.Game, {
            foreignKey: 'gameId',
            as: 'game'
        });

        MathOperation.hasMany(models.MathOption, {
            foreignKey: 'idOperation',
            as: 'options'
        });
    };

    return MathOperation;
};