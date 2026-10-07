const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const StoryAccess = sequelize.define('StoryAccess', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        storyId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'STORY_ID'
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'USER_ID'
        },
        grantedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'GRANTED_BY'
        },
        accessGranted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'ACCESS_GRANTED'
        },
        grantDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'GRANT_DATE'
        },
        revokeDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'REVOKE_DATE'
        },
        notes: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'NOTES'
        }
    }, {
        tableName: 'STORY_ACCESS',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['USER_ID', 'STORY_ID']
            }
        ]
    });

    StoryAccess.associate = (models) => {
        StoryAccess.belongsTo(models.Story, {
            foreignKey: 'storyId',
            as: 'story'
        });

        StoryAccess.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });

        StoryAccess.belongsTo(models.Admin, {
            foreignKey: 'grantedBy',
            as: 'grantedByAdmin'
        });
    };

    return StoryAccess;
};