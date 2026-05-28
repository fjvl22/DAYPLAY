module.exports = (sequelize, DataTypes) => {

    const SystemEvent = sequelize.define('SystemEvent', {

        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },

        actorType: {
            type: DataTypes.ENUM('ADMIN','USER','PENDING','SYSTEM'),
            allowNull: false,
            field: 'ACTOR_TYPE'
        },

        actorId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'ACTOR_ID'
        },

        targetType: {
            type: DataTypes.ENUM('ADMIN','USER','PENDING','GAME','PAYMENT','STORY','NONE'),
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
                'AUTH','USER_MANAGEMENT','GAME_MANAGEMENT',
                'GAMEPLAY','REWARDS','PAYMENT','NOTIFICATION','SYSTEM'
            ),
            allowNull: false,
            field: 'CATEGORY'
        },

        description: {
            type: DataTypes.TEXT,
            field: 'DESCRIPTION'
        },

        eventDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'EVENT_DATE'
        },

        ipAddress: {
            type: DataTypes.STRING(45),
            field: 'IP_ADDRESS'
        }

    }, {
        tableName: 'SYSTEM_EVENT',
        timestamps: false
    });

    SystemEvent.associate = (models) => {

        SystemEvent.belongsTo(models.Admin, {
            foreignKey: 'actorId',
            targetKey: 'personId',
            constraints: false,
            as: 'actorAdmin'
        });

        SystemEvent.belongsTo(models.AppUser, {
            foreignKey: 'actorId',
            targetKey: 'personId',
            constraints: false,
            as: 'actorUser'
        });

        SystemEvent.belongsTo(models.Admin, {
            foreignKey: 'targetId',
            targetKey: 'personId',
            constraints: false,
            as: 'targetAdmin'
        });

        SystemEvent.belongsTo(models.AppUser, {
            foreignKey: 'targetId',
            targetKey: 'personId',
            constraints: false,
            as: 'targetUser'
        });
    };

    return SystemEvent;
};