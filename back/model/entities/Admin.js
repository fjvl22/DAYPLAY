const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        personId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            field: 'PERSON_ID'
        },
        department: {
            type: DataTypes.ENUM(
                'GAME',
                'PAYMENT',
                'EVENT',
                'NOTIF'
            ),
            allowNull: false,
            field: 'DEPARTMENT'
        }
    }, {
        tableName: 'ADMIN',
        timestamps: false
    });

    Admin.associate = (models) => {
        Admin.belongsTo(models.Person, {
            foreignKey: 'personId',
            as: 'person'
        });

        Admin.hasMany(models.AppUser, {
            foreignKey: 'approvedBy',
            as: 'approvedUsers'
        });

        Admin.hasMany(models.PaymentTrace, {
            foreignKey: 'updatedBy',
            as: 'paymentTraces'
        });

        Admin.hasMany(models.Notification, {
            foreignKey: 'createdBy',
            as: 'notifications'
        });

        Admin.hasMany(models.StoryAccess, {
            foreignKey: 'grantedBy',
            as: 'storyAccesses'
        });

        Admin.hasMany(models.AdminInvitation, {
            foreignKey: 'createdBy',
            as: 'invitations'
        });
    };

    return Admin;
};