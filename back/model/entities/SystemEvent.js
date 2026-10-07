const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SystemEvent = sequelize.define('SystemEvent', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        actorType: {
            type: DataTypes.ENUM(
                'ADMIN',
                'USER',
                'PENDING',
                'SYSTEM'
            ),
            allowNull: false,
            field: 'ACTOR_TYPE'
        },
        actorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'ACTOR_ID'
        },
        targetType: {
            type: DataTypes.ENUM(
                'ADMIN',
                'USER',
                'PENDING',
                'GAME',
                'PAYMENT',
                'STORY',
                'NONE'
            ),
            allowNull: false,
            field: 'TARGET_TYPE'
        },
        targetId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'TARGET_ID'
        },
        eventType: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'EVENT_TYPE'
        },
        category: {
            type: DataTypes.ENUM(
                'AUTH',
                'USER_MANAGEMENT',
                'GAME_MANAGEMENT',
                'GAMEPLAY',
                'REWARDS',
                'PAYMENT',
                'NOTIFICATION',
                'SYSTEM'
            ),
            allowNull: false,
            field: 'CATEGORY'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'DESCRIPTION'
        },
        eventDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'EVENT_DATE'
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
            field: 'IP_ADDRESS'
        }
    }, {
        tableName: 'SYSTEM_EVENT',
        timestamps: false
    });

    return SystemEvent;
};