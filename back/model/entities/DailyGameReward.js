const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const DailyGameReward = sequelize.define('DailyGameReward', {
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
        rewardDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            field: 'REWARD_DATE'
        },
        totalScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'TOTAL_SCORE'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'CREATED_AT'
        }
    }, {
        tableName: 'DAILY_GAME_REWARD',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['USER_ID', 'REWARD_DATE']
            }
        ]
    });

    DailyGameReward.associate = (models) => {
        DailyGameReward.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return DailyGameReward;
};