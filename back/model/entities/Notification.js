const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Notification = sequelize.define('Notification', {
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
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'TYPE'
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: 'TITLE'
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'MESSAGE'
        },
        sentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'SENT_DATE'
        },
        createdBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'CREATED_BY'
        },
        readFlag: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'READ_FLAG'
        }
    }, {
        tableName: 'NOTIFICATION',
        timestamps: false
    });

    Notification.associate = (models) => {
        Notification.belongsTo(models.AppUser, {
            foreignKey: 'userId',
            as: 'user'
        });

        Notification.belongsTo(models.Admin, {
            foreignKey: 'createdBy',
            as: 'createdByAdmin'
        });
    };

    return Notification;
};