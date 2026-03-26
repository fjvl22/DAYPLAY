const bcrypt = require('bcryptjs');
const { sequelize } = require('sequelize');
const { Person } = require('../../models/person');
const { Admin } = require('../../models/admin');
const { AppUser } = require('../../models/appUser');
const { UserPending } = require('../../models/userPending');
const { SystemEvent } = require('../../models/systemEvent');
const { UserPlan } = require('../../models/userPlan');
const { TokenBlackList } = require('../../models/tokenBlacklist');
const { generateToken } = require('../../utils/jwt');
const { getPermissionsByDepartment } = require('../admin/admin.service');
const jwt = require('jsonwebtoken');
const systemEvent = require('../../models/systemEvent');

exports.login = async (nickname, password) => {
    const person = await Person.findOne({
        where: { nickname, active: true },
        include: [
            { model: Admin },
            { model: AppUser },
            { model: UserPending }
        ]
    });
    if (!person) throw new Error('User not found');
    const validPassword = await bcrypt.compare(password, person.passwordHash);
    if (!validPassword) {
        await SystemEvent.create({
            userId: person?.id || null,
            eventType: 'LOGIN_FAILED',
            description: `Intento de login fallido`,
            category: 'SYSTEM'
        });
        throw new Error('Incorrect credentials');
    }
    if (person.personType === 'ADMIN') {
        await SystemEvent.create({
            adminId: person.personType === 'ADMIN' ? person.id : null,
            userId: person.personType === 'USER' ? person.id : null,
            eventType: 'LOGIN_SUCCESS',
            description: `Login correcto (${person.personType})`,
            category: person.personType === 'ADMIN' ? 'ADMIN' : 'USER'
        });
        return generateToken({
            id: person.id,
            role: 'ADMIN',
            adminType: person.Admin?.adminType,
            department: person.Admin?.department,
            permissions: person.Admin?.permissions,
            status: 'ACTIVE'
        });
    }
    if (person.AppUser) {
        await SystemEvent.create({
            adminId: person.personType === 'ADMIN' ? person.id : null,
            userId: person.personType === 'USER' ? person.id : null,
            eventType: 'LOGIN_SUCCESS',
            description: `Login correcto (${person.personType})`,
            category: person.personType === 'ADMIN' ? 'ADMIN' : 'USER'
        });
        return generateToken({
            id: person.id,
            role: 'USER',
            planId: person.AppUser.planId,
            subscriptionDate: person.AppUser.subscriptionDate,
            status: 'ACTIVE',
            nickname: person.nickname
        });
    }
    if (person.UserPending) {
        await SystemEvent.create({
            adminId: person.personType === 'ADMIN' ? person.id : null,
            userId: person.personType === 'USER' ? person.id : null,
            eventType: 'LOGIN_SUCCESS',
            description: `Login correcto (${person.personType})`,
            category: person.personType === 'ADMIN' ? 'ADMIN' : 'USER'
        });
        return generateToken({
            id: person.id,
            role: 'USER',
            status: 'PENDING'
        });
    }
    await SystemEvent.create({
        userId: person?.id || null,
        eventType: 'LOGIN_FAILED',
        description: `Intento de login fallido`,
        category: 'SYSTEM'
    });
    throw new Error('User state invalid');
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
        await transaction.commit();
        await systemEvent.create({
            adminId: person.id,
            eventType: 'ADMIN_CREATED',
            description: `Nuevo admin creado (${adminType})`,
            category: 'ADMIM'
        });
        return {
            message: 'Admin registrado correctamente.',
            personId: person.id,
            department,
            adminType,
            permissions
        };
    } catch (error) {
        await transaction.rollback();
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

exports.logout = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await TokenBlackList.create({
            token, expiresAt: new Date(decoded.exp * 1000)
        });
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