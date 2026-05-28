module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define('Admin', {

        personId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            field: 'PERSON_ID'
        },

        department: {
            type: DataTypes.ENUM('GAME','PAYMENT','EVENT','NOTIF'),
            allowNull: false,
            field: 'DEPARTMENT'
        },

        permissions: {
            type: DataTypes.JSON,
            field: 'PERMISSIONS'
        }

    }, {
        tableName: 'ADMIN',
        timestamps: false
    });

    Admin.associate = (models) => {

        Admin.belongsTo(models.Person, {
            foreignKey: 'personId',
            targetKey: 'id'
        });

        Admin.hasMany(models.SystemEvent, {
            foreignKey: 'actorId',
            sourceKey: 'personId',
            constraints: false,
            scope: { actorType: 'ADMIN' }
        });

        Admin.hasMany(models.SystemEvent, {
            foreignKey: 'targetId',
            sourceKey: 'personId',
            constraints: false,
            scope: { targetType: 'ADMIN' }
        });
    };

    return Admin;
};