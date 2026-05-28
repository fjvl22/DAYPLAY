const bcrypt = require('bcryptjs');
const sequelize = require('../../config/database');
const { Person, TokenBlacklist, Admin, AppUser, UserPending, UserPlan } = require('../../models');

const jwtService = require('../jwt/jwt.service');
const { getPermissionsByDepartment } = require('../admin/admin.service');
const AppError = require('../../errors/AppError');

const { createEvent } = require('../../services/systemEvent.service');

exports.login = async (nickname, password, rememberMe) => {

    const cleanNickname = nickname?.trim();

    const person = await Person.findOne({
        where: {
            active: true,
            nickname: cleanNickname
        },
        include: [
            { model: Admin, required: false },
            { model: AppUser, required: false },
            { model: UserPending, required: false }
        ]
    });

    if (!person) throw new AppError('Nickname not found', 404);

    const validPassword = await bcrypt.compare(password, person.passwordHash);
    if (!validPassword) throw new AppError('Incorrect password', 401);

    let payload;

    if (person.personType === 'ADMIN') {

        if (!person.Admin) throw new AppError('Admin data missing', 500);

        payload = {
            personId: person.id,
            nickname: person.nickname,
            role: 'ADMIN',
            department: person.Admin.department,
            permissions: person.Admin.permissions,
            status: 'ACTIVE'
        };

    } else if (person.AppUser) {

        payload = {
            personId: person.id,
            nickname: person.nickname,
            role: 'USER',
            planId: person.AppUser.planId,
            subscriptionDate: person.AppUser.subscriptionDate,
            status: 'ACTIVE'
        };

    } else if (person.UserPending) {

        payload = {
            personId: person.id,
            nickname: person.nickname,
            role: 'USER',
            status: 'PENDING'
        };

    } else {
        throw new AppError('User state invalid', 400);
    }

    const tokens = jwtService.generateTokens(payload, rememberMe);

    await TokenBlacklist.create({
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + (rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000)
    });

    return tokens;
};

exports.logout = async (accessToken, refreshToken) => {

    const decoded = jwtService.verifyAccessToken(accessToken);

    await TokenBlacklist.create({
        token: accessToken,
        expiresAt: new Date(decoded.exp * 1000)
    });

    if (refreshToken) {
        await TokenBlacklist.destroy({ where: { token: refreshToken } });
    }

    try {
        await createEvent({
            actorType: 'USER',
            actorId: decoded.personId,
            targetType: 'NONE',
            targetId: null,
            eventType: 'LOGOUT',
            category: 'AUTH',
            description: 'Usuario cerró sesión'
        });
    } catch (err) {
        console.error('SystemEvent failed but ignored:', err.message);
    }

    return { message: 'Logged out successfully' };
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

        const permissions = await getPermissionsByDepartment(department);

        await Admin.create({
            personId: person.id,
            department,
            permissions
        }, { transaction });

        await createEvent({
            actorType: 'SYSTEM',
            actorId: null,
            targetType: 'ADMIN',
            targetId: person.id,
            eventType: 'ADMIN_CREATED',
            category: 'AUTH',
            description: 'Nuevo admin creado'
        });

        await transaction.commit();

        return {
            message: 'Admin registrado correctamente.',
            personId: person.id,
            department,
            permissions
        };

    } catch (error) {
        if (transaction && !transaction.finished) await transaction.rollback();
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

        await createEvent({
            actorType: 'USER',
            actorId: person.id,
            targetType: 'NONE',
            targetId: null,
            eventType: 'USER_REGISTERED',
            category: 'USER_MANAGEMENT',
            description: 'Usuario registrado en estado PENDING'
        });

        await transaction.commit();

        return { message: 'User registered successfully. Pending approval.' };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.deleteAccount = async (userId, password) => {
    const transaction = await sequelize.transaction();

    try {
        const person = await Person.findOne({
            where: { id: userId, active: true },
            include: [Admin, AppUser, UserPending],
            transaction
        });

        if (!person) throw new Error('Person not found');

        const validPassword = await bcrypt.compare(password, person.passwordHash);
        if (!validPassword) throw new Error('Password incorrect');

        person.active = false;
        await person.save({ transaction });

        await transaction.commit();

        await createEvent({
            actorType: 'USER',
            actorId: userId,
            targetType: 'USER',
            targetId: userId,
            eventType: 'ACCOUNT_DEACTIVATED',
            category: 'USER_MANAGEMENT',
            description: 'Cuenta desactivada por el usuario'
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

        await createEvent({
            actorType: 'USER',
            actorId: userId,
            targetType: 'USER',
            targetId: userId,
            eventType: 'PASSWORD_CHANGED',
            category: 'AUTH',
            description: 'Usuario cambió su contraseña'
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