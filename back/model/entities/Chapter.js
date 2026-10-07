const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Story = sequelize.define('Story', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'TITLE'
        },
        monthYear: {
            type: DataTypes.CHAR(7),
            allowNull: false,
            unique: true,
            field: 'MONTH_YEAR'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'DESCRIPTION'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'ACTIVE'
        },
        creationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'CREATION_DATE'
        }
    }, {
        tableName: 'STORY',
        timestamps: false
    });

    Story.associate = (models) => {
        Story.hasMany(models.Chapter, {
            foreignKey: 'storyId',
            as: 'chapters'
        });

        Story.hasMany(models.StoryAccess, {
            foreignKey: 'storyId',
            as: 'accesses'
        });
    };

    return Story;
};