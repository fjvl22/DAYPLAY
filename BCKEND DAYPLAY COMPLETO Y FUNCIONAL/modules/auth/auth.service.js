const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');
const { Person, TokenBlacklist } = require('../../models');
const { Admin } = require('../../models');
const { AppUser } = require('../../models');
const { UserPending } = require('../../models');
const { SystemEvent } = require('../../models');
const { UserPlan } = require('../../models');
const jwtService = require('../jwt/jwt.service');
const { getPermissionsByDepartment } = require('../admin/admin.service');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../../models/tokenBlacklist');

exports.login = async (nickname, password) => {

    const person = await Person.findOne({
        where: { nickname, active: true },
        include: [Admin, AppUser, UserPending]
    });

    if (!person) throw new Error('User not found');

    const validPassword = await bcrypt.compare(password, person.passwordHash);
    if (!validPassword) throw new Error('Incorrect credentials');

    let payload;

    if (person.personType === 'ADMIN') {
        payload = {
            id: person.id,
            nickname: person.nickname,
            role: 'ADMIN',
            adminType: person.Admin?.adminType,
            department: person.Admin?.department,
            permissions: person.Admin?.permissions,
            status: 'ACTIVE'
        };
    } else if (person.AppUser) {
        payload = {
            id: person.id,
            nickname: person.nickname,
            role: 'USER',
            planId: person.AppUser.planId,
            subscriptionDate: person.AppUser.subscriptionDate,
            status: 'ACTIVE'
        };
    } else if (person.UserPending) {
        payload = {
            id: person.id,
            nickname: person.nickname,
            role: 'USER',
            status: 'PENDING'
        };
    } else { throw new Error('User state invalid'); }

    const tokens = jwtService.generateTokens(payload);

    await tokenBlacklist.create({
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now()+7*24*60*60*1000)
    });

    await SystemEvent.create({
        userId: person.id,
        eventType: 'LOGIN_SUCCESS',
        description: `Login correcto (${person.personType})`,
        category: person.personType === 'ADMIN' ? 'ADMIN' : 'USER'
    });

    return tokens;
};

exports.logout = async (accessToken, refreshToken) => {
    try {
        const decoded = jwtService.verifyAccessToken(accessToken);

        await TokenBlacklist.create({
            token: accessToken,
            expiresAt: new Date(decoded.exp * 100)
        });

        if (refreshToken) {
            await tokenBlacklist.destroy({ where: { token: refreshToken } });
        }

        await SystemEvent.create({
            userId: decoded.id,
            eventType: 'LOGOUT',
            description: 'Usuario cerró sesión',
            category: 'USER'
        });

        return { message: 'Logged out successfully' };

    } catch (error) {
        throw new Error('Invalid token');
    }
};

exports.adminRegistration = async (data) => {
    const { nickname, password, email } = data;
    const transaction = await sequelize.transaction();
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const person = await Person.create({
            nickname,
            email,
            passwordHash,
            personType: 'ADMIN',
            active: true
        }, { transaction });
        const departments = ['GAME', 'PAYMENT', 'EVENT', 'NOTIF'];
        const adminCount = await Admin.count({ transaction });
        const department = departments[adminCount % departments.length];
        const adminTypeMap = {
            GAME: 'GAME_ADMIN',
            PAYMENT: 'PAYMENT_ADMIN',
            EVENT: 'EVENT_ADMIN',
            NOTIF: 'NOTIF_ADMIN'
        };
        const adminType = adminTypeMap[department];
        const permissions = await getPermissionsByDepartment(department);
        await Admin.create({
            personId: person.id,
            department,
            adminType,
            permissions
        }, { transaction });
        await SystemEvent.create({
            adminId: person.id,
            eventType: 'ADMIN_CREATED',
            description: `Nuevo admin creado (${adminType})`,
            category: 'ADMIN'
        }, { transaction });
        await transaction.commit();
        return {
            message: 'Admin registrado correctamente.',
            personId: person.id,
            department,
            adminType,
            permissions
        };
    } catch (error) {
        if (transaction && !transaction.finished) await transaction.rollback();
        console.error("ERROR REGISTRO:", error);
        throw error;
    }
};

exports.userRegistration = async (data) => {
    const { nickname, password, email } = data;
    const transaction = await sequelize.transaction();
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const person = await Person.create({
            nickname,
            email,
            passwordHash,
            personType: 'USER',
            active: true
        }, { transaction });
        await UserPending.create({
            personId: person.id
        }, { transaction });
        await transaction.commit();
        await SystemEvent.create({
            userId: person.id,
            eventType: 'USER_REGISTERED',
            description: 'Usuario registrado en estado PENDING',
            category: 'USER'
        });
        return { message: 'User registered successfully. Pending approval.' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteAccount = async (userId, password) => {
    const transaction = await sequelize.transaction();
    try{
        const person = await Person.findOne({
            where: { id: userId, active: true },
            include: [Admin, AppUser, UserPending],
            transaction
        });
        if (!person) {
            throw new Error('Person not found');
        }
        const validPassword = await bcrypt.compare(password, person.passwordHash);
        if (!validPassword) {
            throw new Error('Password incorrect');
        }
        person.active = false;
        await person.save({ transaction });
        await transaction.commit();
        await SystemEvent.create({
            userId,
            eventType: 'ACCOUNT_DEACTIVATED',
            description: 'Cuenta desactivada por el usuario',
            category: 'USER'
        });
        return { message: 'Account deleted successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
    const transaction = await sequelize.transaction();
    try {
        const person = await Person.findOne({
            where: { id: userId, active: true },
            transaction
        });
        if (!person) throw new Error('User not found');
        const validPassword = await bcrypt.compare(currentPassword, person.passwordHash);
        if (!validPassword) throw new Error('Current password is incorrect');
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        person.passwordHash = newPasswordHash;
        await person.save({ transaction });
        await transaction.commit();
        await SystemEvent.create({
            userId,
            eventType: 'PASSWORD_CHANGED',
            description: 'Usuario cambió su contraseña',
            category: person.personType === 'ADMIN' ? 'ADMIN' : 'USER'
        });
        return { message: 'Password changed successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.getPlanTypes = async () => {
    return UserPlan.getPlanTypes();
};