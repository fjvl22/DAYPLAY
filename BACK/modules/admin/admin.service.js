const sequelize = require('../../config/database');
const {
    Admin,
    AppUser,
    Person,
    UserPending,
    Game,
    GameWord,
    MathOperation,
    MathOption,
    DailyGameReward,
    Story,
    StoryAccess,
    Chapter,
    Payment,
    PaymentTrace,
    Notification,
    SystemEvent,
    UserPlan
} = require('../../models');

const { chargeUser } = require('../payment/payment.service');
const { sendEmail } = require('../../services/email.service');
const { createNotification } = require('../../services/notification.service');
const { Op, or } = require('sequelize');

const { createEvent } = require('../../services/systemEvent.service');

const getAdmin = (admin) => {
    if (!admin) throw new Error('Admin required');
    return admin;
};

exports.getUsers = async () => {
    return await AppUser.findAll({ include: Person });
};

exports.getPendingUsers = async () => {
    return await UserPending.findAll({ include: Person });
};

exports.approvePendingUser = async (admin, pendingUserId, plan) => {

    const transaction = await sequelize.transaction();

    try {
        const pending = await UserPending.findByPk(pendingUserId, { transaction });
        if (!pending) throw new Error('Pending user not found');

        const userPlan = await UserPlan.findOne({
            where: { planType: plan, active: true },
            transaction
        });

        if (!userPlan) throw new Error('Plan not found');

        const amount = userPlan.planType === 'BASIC' ? 10 : 15;

        const paymentResult = await chargeUser(
            pending.personId,
            admin.personId,
            amount
        );

        const appUser = await AppUser.create({
            personId: pending.personId,
            subscriptionDate: new Date(),
            planId: userPlan.id
        }, { transaction });

        await pending.destroy({ transaction });

        await createEvent({
            actorType: 'ADMIN',
            actorId: admin.personId,
            targetType: 'USER',
            targetId: appUser.personId,
            eventType: 'USER_APPROVED',
            category: 'USER_MANAGEMENT',
            description: `Usuario aprobado con plan ${userPlan.planType}`
        });

        await transaction.commit();

        return paymentResult;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.rejectPendingUser = async (pendingUserId, adminId) => {

    const pending = await UserPending.findByPk(pendingUserId);

    if (!pending) throw new Error('Pending user not found');

    await pending.destroy();

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: pending.personId,
        eventType: 'USER_REJECTED',
        category: 'USER_MANAGEMENT',
        description: 'Usuario pendiente rechazado'
    });

    return { message: 'User rejected' };
};

exports.updateUser = async (id, data, adminId) => {

    const user = await AppUser.findByPk(id);

    if (!user) throw new Error('User not found');

    await user.update(data);

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: user.personId,
        eventType: 'USER_UPDATED',
        category: 'USER_MANAGEMENT',
        description: 'Datos del usuario actualizados'
    });

    return user;
};

exports.deleteUser = async (id, adminId) => {

    const person = await Person.findByPk(id);

    if (!person) throw new Error('Person not found');

    person.active = false;
    await person.save();

    const user = await AppUser.findByPk(id);

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: id,
        eventType: 'USER_DEACTIVATED',
        category: 'USER_MANAGEMENT',
        description: 'Usuario desactivado por administrador'
    });

    return { message: 'Person deactivated' };
};

exports.getGames = async () => Game.findAll();

exports.getHangmanWords = async () =>
    GameWord.findAll({ where: { gameId: 1 } });

exports.getWordleWords = async () =>
    GameWord.findAll({ where: { gameId: 4 } });

exports.getMathOperations = async () =>
    MathOperation.findAll({ include: [MathOption] });

exports.insertGameWord = async (data) => {
    const { gameId, word, language, adminId } = data;

    const transaction = await sequelize.transaction();

    try {
        const createdWord = await GameWord.create({
            gameId,
            word: word.toLowerCase(),
            language: language || 'ES'
        }, { transaction });

        await createEvent({
            actorType: 'ADMIN',
            actorId: adminId,
            targetType: 'GAME',
            targetId: gameId,
            eventType: 'GAME_WORD_CREATED',
            category: 'GAME_MANAGEMENT',
            description: `Nueva palabra añadida al juego ${gameId}`
        });

        await transaction.commit();
        return createdWord;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.insertMathOperation = async (data) => {
    const { gameId, operation, result, options, adminId } = data;

    if (!gameId || !operation || !result)
        throw new Error('Missing fields');

    const transaction = await sequelize.transaction();

    try {
        const mathOp = await MathOperation.create({
            gameId,
            operation,
            result
        }, { transaction });

        for (const opt of options) {
            await MathOption.create({
                operationId: mathOp.id,
                optionValue: opt
            }, { transaction });
        }

        await createEvent({
            actorType: 'ADMIN',
            actorId: adminId,
            targetType: 'GAME',
            targetId: gameId,
            eventType: 'MATH_OPERATION_CREATED',
            category: 'GAME_MANAGEMENT',
            description: `Nueva operación matemática añadida al juego ${gameId}`
        });

        await transaction.commit();

        return mathOp;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

exports.getRewards = async ({ sortByDate = false, sortByScore = false } = {}) => {

    const order = [];

    if (sortByDate) order.push(['rewardDate', 'DESC']);

    if (sortByScore) order.push(['totalScore', 'DESC']);

    if (order.length === 0) order.push(['id', 'DESC']);

    return await DailyGameReward.findAll({
        include: [
            {
                model: AppUser,
                include: [Person]
            }
        ],
        order
    });
};

exports.approveReward = async (userId, adminId) => {

    const reward = await DailyGameReward.findOne({ where: { userId } });
    if (!reward) throw new Error('Reward not found');

    const currentYearMonth = new Date().toISOString().slice(0, 7);

    const story = await Story.findOne({ where: { monthYear: currentYearMonth } });
    if (!story) throw new Error('Month story not found');

    const admin = await Admin.findByPk(adminId);
    if (!admin) throw new Error('Admin not found');

    await StoryAccess.create({
        storyId: story.id,
        userId,
        grantedBy: admin.personId,
        accessGranted: true,
        grantDate: new Date(),
        revokeDate: null,
        notes: `Acceso concedido por recompensa diaria`
    });

    await reward.destroy();

    const chapter = await Chapter.findOne({
        where: {
            storyId: story.id,
            dayNumber: new Date().getDate()
        }
    });

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: userId,
        eventType: 'REWARD_APPROVED',
        category: 'REWARDS',
        description: 'Recompensa diaria aprobada'
    });

    return chapter;
};

exports.rejectReward = async (userId, adminId) => {

    const reward = await DailyGameReward.findOne({ where: { userId } });
    if (!reward) throw new Error('Reward not found');

    const currentYearMonth = new Date().toISOString().slice(0, 7);

    const story = await Story.findOne({ where: { monthYear: currentYearMonth } });
    if (!story) throw new Error('Month story not found');

    const admin = await Admin.findByPk(adminId);
    if (!admin) throw new Error('Admin not found');

    await StoryAccess.create({
        storyId: story.id,
        userId,
        grantedBy: admin.personId,
        accessGranted: false,
        revokeDate: new Date(),
        notes: `Acceso rechazado por administrador`
    });

    await reward.destroy();

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: userId,
        eventType: 'REWARD_REJECTED',
        category: 'REWARDS',
        description: 'Recompensa diaria rechazada'
    });

    return { success: true };
};

exports.sendToUser = async ({ userId, title, message, type, createdBy }) => {

    const user = await AppUser.findByPk(userId, { include: [Person] });
    if (!user) throw new Error('User not found');

    await createNotification({ userId, title, message, type, createdBy });

    await sendEmail({
        to: user.Person.email,
        subject: title,
        html: `<p>${message}</p>`
    });

    await createEvent({
        actorType: 'ADMIN',
        actorId: createdBy,
        targetType: 'USER',
        targetId: userId,
        eventType: 'NOTIFICATION_SENT',
        category: 'NOTIFICATION',
        description: `Notificación enviada al usuario: ${title}`
    });

    return { success: true };
};

exports.sendToAllUsers = async ({ title, message, type, createdBy }) => {

    const users = await AppUser.findAll({ include: [Person] });

    for (const user of users) {
        await createNotification({
            userId: user.id,
            title,
            message,
            type,
            createdBy
        });

        await sendEmail({
            to: user.Person.email,
            subject: title,
            html: `<p>${message}</p>`
        });
    }

    await createEvent({
        actorType: 'ADMIN',
        actorId: createdBy,
        targetType: 'NONE',
        targetId: null,
        eventType: 'GLOBAL_NOTIFICATION_SENT',
        category: 'NOTIFICATION',
        description: `Notificación global enviada: ${title}`
    });

    return { success: true, sent: users.length };
};

exports.getAdmins = async () => {
    return await Admin.findAll({
        include: [Person]
    });
};

exports.getPermissionsByDepartment = async (department) => {
    const map = {
        GAME: { canManageGames: true },
        PAYMENT: { canChargeUsers: true },
        NOTIF: { canSendNotifications: true },
        EVENT: { canCreateEvents: true }
    };

    return map[department] || {};
};

exports.getAllEvents = async (filters) => {

    const where = {};

    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.category) where.category = filters.category;

    if (filters.adminId) where.actorId = filters.adminId;
    if (filters.userId) where.targetId = filters.userId;

    if (filters.from && filters.to) {
        where.eventDate = {
            [Op.between]: [new Date(filters.from), new Date(filters.to)]
        };
    }

    const events = await SystemEvent.findAll({
        where,
        include: [
            {
                model: Admin,
                as: 'actorAdmin',
                required: false,
                include: [
                    {
                        model: Person,
                        attributes: ['nickname']
                    }
                ]
            },
            {
                model: AppUser,
                as: 'actorUser',
                required: false,
                include: [
                    {
                        model: Person,
                        attributes: ['nickname']
                    }
                ]
            }
        ],
        order: [['eventDate', 'DESC']]
    });

    return events.map(e => ({
        id: e.id,
        actorType: e.actorType,
        actorId: e.actorId,
        targetType: e.targetType,
        targetId: e.targetId,
        eventType: e.eventType,
        description: e.description,
        category: e.category,
        eventDate: e.eventDate,
        ipAddress: e.ipAddress,

        admin: e.actorAdmin ? {
            id: e.actorAdmin.id,
            person: e.actorAdmin.Person ? {
                nickname: e.actorAdmin.Person.nickname
            } : undefined
        } : undefined,

        appUser: e.actorUser ? {
            id: e.actorUser.id,
            person: e.actorUser.Person ? {
                nickname: e.actorUser.Person.nickname
            } : undefined
        } : undefined
    }));
};


exports.getPayments = async () => {

    const payments = await Payment.findAll({
        include: [
            {
                model: AppUser,
                required: false,
                include: [
                    {
                        model: Person,
                        attributes: ['nickname', 'email']
                    }
                ]
            }
        ],
        order: [['id', 'DESC']]
    });

    return payments.map(p => ({
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        status: p.status,
        date: p.createdAt || p.date,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        appUser: p.AppUser ? {
            id: p.AppUser.id,
            person: p.AppUser.Person ? {
                nickname: p.AppUser.Person.nickname,
                email: p.AppUser.Person.email
            } : undefined
        } : undefined
    }));
};

exports.getPaymentById = async (id) => {

    const p = await Payment.findByPk(id, {
        include: [
            {
                model: AppUser,
                required: false,
                include: [
                    {
                        model: Person,
                        attributes: ['nickname', 'email']
                    }
                ]
            }
        ]
    });

    if (!p) throw new Error('Payment not found');

    return {
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        status: p.status,
        date: p.createdAt || p.date,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        appUser: p.AppUser ? {
            id: p.AppUser.id,
            person: p.AppUser.Person ? {
                nickname: p.AppUser.Person.nickname,
                email: p.AppUser.Person.email
            } : undefined
        } : undefined
    };
};

exports.getPaymentTraces = async (paymentId) => {

    const traces = await PaymentTrace.findAll({
        where: { paymentId },
        order: [['id', 'DESC']],
        include: [
            {
                model: Admin,
                required: false,
                include: [
                    {
                        model: Person,
                        attributes: ['nickname']
                    }
                ]
            }
        ]
    });

    return traces.map(t => ({
        id: t.id,
        paymentId: t.paymentId,
        traceDate: t.createdAt || t.traceDate,
        action: t.action,
        notes: t.notes,
        updatedBy: t.Admin ? {
            id: t.Admin.id,
            person: t.Admin.Person ? {
                nickname: t.Admin.Person.nickname
            } : undefined
        } : undefined
    }));
};