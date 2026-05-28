module.exports = (sequelize, DataTypes) => {

    const Person = sequelize.define('Person', {

        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
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
            defaultValue: DataTypes.NOW,
            field: 'REGISTRATION_DATE'
        },

        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            field: 'ACTIVE'
        },

        personType: {
            type: DataTypes.ENUM('USER','ADMIN'),
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
            sourceKey: 'id'
        });

        Person.hasOne(models.AppUser, {
            foreignKey: 'personId',
            sourceKey: 'id'
        });

        Person.hasOne(models.UserPending, {
            foreignKey: 'personId',
            sourceKey: 'id'
        });
    };

    return Person;
};