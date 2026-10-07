const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Person = sequelize.define('Person', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            field: 'ID'
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'NICKNAME'
        },
        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'PASSWORD_HASH'
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            field: 'EMAIL'
        },
        registrationDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'REGISTRATION_DATE'
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'ACTIVE'
        },
        personType: {
            type: DataTypes.ENUM('USER', 'ADMIN'),
            allowNull: false,
            field: 'PERSON_TYPE'
        }
    }, {
        tableName: 'PERSON',
        timestamps: false
    });

    Person.associate = (models) => {
        Person.hasOne(models.Admin, {
            foreignKey: 'personId',
            as: 'admin'
        });

        Person.hasOne(models.AppUser, {
            foreignKey: 'personId',
            as: 'appUser'
        });

        Person.hasOne(models.UserPending, {
            foreignKey: 'personId',
            as: 'userPending'
        });
    };

    return Person;
};