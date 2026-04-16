const { Op } = require('sequelize');
const sequelize = require('../../config/database');

const { Person } = require('../../models');
const { Admin } = require('../../models');
const { AppUser } = require('../../models');
const { UserPending } = require('../../models');
const { Game } = require('../../models');
const { GameWord } = require('../../models');
const { MathOperation } = require('../../models');
const { MathOption } = require('../../models');
const { GameMatch } = require('../../models');
const { DailyGameReward } = require('../../models');
const { Story } = require('../../models');
const { StoryAccess } = require('../../models');
const { Chapter } = require('../../models');
const { Payment } = require('../../models');
const { PaymentTrace } = require('../../models');
const { Notification } = require('../../models');
const { SystemEvent } = require('../../models');
const { UserPlan } = require('../../models');

const { chargeUser } = require('../../services/payment.service');
const { sendEmail } = require('../../services/email.service');
const { createNotification } = require('../../services/notification.service');

exports.getUsers = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (!['GAME_ADMIN', 'PAYMENT_ADMIN'].includes(admin.adminType)) throw new Error('Permission denied');
    return await AppUser.findAll({ include: Person });
};

exports.getPendingUsers = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await UserPending.findAll({ include: Person });
};

exports.approvePendingUser = async (adminId, pendingUserId, plan) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'PAYMENT_ADMIN') throw new Error('Permission denied');
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
        await chargeUser(pending.personId, admin.personId, amount);
        const appUser = await AppUser.create({
            personId: pending.personId,
            subscriptionDate: new Date(),
            planId: userPlan.id
        }, { transaction });
        await pending.destroy({ transaction });
        await transaction.commit();
        await SystemEvent.create({
            adminId: admin.personId,
            userId: pending.personId,
            eventType: 'USER_APPROVED',
            description: `Usuario aprobado con plan ${userPlan.planType}`,
            category: 'ADMIN'
        });
        return appUser;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.rejectPendingUser = async (adminId, pendingUserId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const pending = await UserPending.findByPk(pendingUserId);
    if (!pending) throw new Error('Pending user not found');
    await pending.destroy();
    const person = await Person.findByPk(pending.personId);
    if (person) await person.destroy();
    await SystemEvent.create({
        adminId: admin.personId,
        userId: pending.personId,
        eventType: 'USER_REJECTED',
        description: 'Usuario rechazado y eliminado',
        category: 'ADMIN'
    });
    return { message: 'User rejected and removed from pending list' };
};

exports.updateUser = async (adminId, id, data) => {
    let admin = await Admin.findByPk(adminId);
    if (!['GAME_ADMIN', 'PAYMENT_ADMIN'].includes(admin.adminType)) throw new Error('Permission denied');
    const user = await AppUser.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(data);
    await SystemEvent.create({
        adminId: admin.personId,
        userId: id,
        eventType: 'USER_UPDATED',
        description: 'Datos de usuario actualizados',
        category: 'ADMIN'
    });
    return user;
};

exports.deleteUser = async (adminId, id) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType!=='GAME_ADMIN') throw new Error('Permission denied');
    const user = await AppUser.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
    await SystemEvent.create({
        adminId: admin.personId,
        userId: id,
        eventType: 'USER_DELETED',
        description: 'Usuario eliminado por admin',
        category: 'ADMIN'
    });
    return { message: 'User correctly deleted' };
};

exports.getGames = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await Game.findAll();
};

exports.getHangmanWords = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const words = await GameWord.findAll({ where: { gameId: 1 } });
    return words;
};

exports.getWordleWords = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const words = await GameWord.findAll({ where: { gameId: 4 } });
    return words;
};

exports.getMathOperations = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    return await MathOperation.findAll({
        include: [{
            model: MathOption,
            attributes: ['id', 'optionValue'],
            required: false
        }],
        order: [
            ['id', 'ASC'],
            [MathOption, 'id', 'ASC']
        ]
    });
};

exports.insertGameWord = async (adminId, data) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const { gameId, word, language } = data;
    if (!gameId || !word) throw new Error('gameId and word are required');
    if (gameId !== 1 && gameId !== 4) throw new Error('Invalid gameId');
    const game = await Game.findByPk(gameId);
    if (!game) throw new Error('Game not found');
    const gameName = game.name;
    const newWord = await GameWord.create({
        gameId,
        word: word.toLowerCase(),
        language: language || 'ES',
        active: true
    });
    await SystemEvent.create({
        adminId: admin.personId,
        eventType: 'GAME_WORD_CREATED',
        description: `Nueva palabra "${word}" añadida al juego ${gameName}`,
        category: 'ADMIN'
    });
    return newWord;
};

exports.insertMathOperation = async (adminId, data) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const { gameId, operation, result, options } = data;
    if (!gameId || !operation || !result) throw new Error('gameId, operation and result are required');
    if (gameId !== 3) throw new Error('Invalid gameId');
    if (!options || options.length !== 4) throw new Error('Exactly 4 options are required');
    const game = await Game.findByPk(gameId);
    if (!game) throw new Error('Gme not found');
    const transaction = await sequelize.transaction();
    try {
        const mathOperation = await MathOperation.create({
            gameId,
            operation,
            result
        }, { transaction });
        for (const op of options) {
            await MathOption.create({
                optionValue: op,
                operationId: mathOperation.id
            }, { transaction });
        }
        await SystemEvent.create({
            adminId: admin.personId,
            eventType: 'MATH_OPERATION_CREATED',
            description: `Operación matemática creada: ${operation}`,
            category: 'ADMIN'
        }, { transaction });
        await transaction.commit();
        return {
            message: 'Math operation correctly created',
            operation: mathOperation
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

exports.canUserPlayToday = async (adminId, userId, gameId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);
    const match = await GameMatch.findOne({
        where: {
            userId,
            gameId,
            date: { [Op.between]: [todayStart, todayEnd] }
        }
    });
    return { canPlay: !match };
};

exports.getDailyRewardRequests = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await DailyGameReward.findAll({ include: Person });
};

exports.approveDailyReward = async (adminId, userId, ipAddress = null) => {
    let admin = await Admin.findByPk(adminId);
    if (!admin || admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied.');
    const dailyGameReward = await DailyGameReward.findOne({ where: { userId } });
    if (!dailyGameReward) return { approved: false, message: 'No pending daily reward' };
    const games = await Game.findAll({ attributes: ['id'] });
    const gameIds = games.map(g => g.id);
    if (!gameIds.length) throw new Error('No games configured in system');
    const todayStart = new Date();
    const todayEnd = new Date();
    todayStart.setHours(0,0,0,0);
    todayEnd.setHours(23,59,59,999);
    const yesterdayStart = new Date(todayStart);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayStart.setDate(yesterdayStart.getDate()-1);
    yesterdayEnd.setDate(yesterdayEnd.getDate()-1);
    const wonYesterday = await GameMatch.count({
        where: {
            userId,
            gameId: { [Op.in]: gameIds },
            score: { [Op.gt]: 0 },
            createdAt: { [Op.between]: [yesterdayStart, yesterdayEnd] }
        },
        distinct: true,
        col: 'gameId'
    });
    const wonToday = await GameMatch.count({
        where: {
            userId,
            gameId: { [Op.in]: gameIds },
            score: { [Op.gt]: 0 },
            createdAt: { [Op.between]: [todayStart, todayEnd] }
        },
        distinct: true,
        col: 'gameId'
    });
    const isFirstDay = wonYesterday === 0;
    const isEligible = (wonToday === gameIds.length) && (wonYesterday === gameIds.length || isFirstDay);
    const currentMonth = todayStart.toLocaleString('default', { month: 'long' });
    const story = await Story.findOne({ where: { monthYear: currentMonth } });
    if (!story) throw new Error('Story not found for current month');
    const chapter = await Chapter.findOne({ where: { storyId: story.id, dayNumber: todayStart.getDate() } });
    if (!chapter) throw new Error('Chapter not found for today');
    const user = await AppUser.findByPk(userId, { include: [UserPlan] });
    const tomorrowMidnight = new Date(todayStart);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate()+1);
    let revokeDate = null;
    let notes = 'Daily chapter auto-approved';
    const plan = await UserPlan.findByPk(user.planId);
    if (isEligible && plan.planType === 'BASIC') {
        revokeDate = tomorrowMidnight;
        notes += ' (expires at midnight)';
    }
    const existingAccess = await StoryAccess.findOne({ where: { storyId: story.id, userId } });
    if (!existingAccess) {
        await StoryAccess.create({
            storyId: story.id,
            userId,
            grantedBy: adminId,
            accessGranted: isEligible,
            grantDate: isEligible ? new Date() : null,
            revokeDate,
            notes: isEligible ? notes : 'Daily chapter auto-rejected'
        });
    }
    await dailyGameReward.destroy();
    if (isEligible) {
        let extraMessage = '';
        if (plan.planType === 'BASIC') extraMessage = '<p><strong>⚠ IMPORTANTE:</strong>Al tener plan básico, el acceso estará disponible solo hasta las 00:00.</p>';
        const person = await Person.findByPk(userId);
        await sendEmail({
            to: person.email,
            subject: '¡Nuevo capítulo desbloqueado!',
            html: `
                <h2>¡Felicidades, ${user.nickname}!</h2>
                <p>Has desbloqueado el capítulo <strong>${chapter.title}</strong>
                de la historia <strong>${story.title}</strong>.</p>
                ${extraMessage}
            `
        });
        await createNotification({
            userId,
            title: plan.planType === 'BASIC' ? `Capítulo ${chapter.title} disponible hasta las 00:00` : `Ya puedes leer el capítulo ${chapter.title}`,
            type: 'DAILY_REWARD'
        });
        await SystemEvent.create({
            adminId: admin.personId,
            userId,
            eventType: 'DAILY_REWARD_GRANTED',
            description: `Capítulo ${chapter.title} concedido (${plan.planType})`,
            category: 'ADMIN',
            ipAddress
        });
    } else {
        await SystemEvent.create({
            adminId: admin.personId,
            userId,
            eventType: 'DAILY_REWARD_REJECTED',
            description: isFirstDay ? 'Usuario nuevo: primer día no cumplió requisitos' : 'Usuario no cumplía requisitos',
            category: 'ADMIN'
        });
    }
};

exports.rejectDailyReward = async (adminId, rewardId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const reward = await DailyGameReward.findByPk(rewardId);
    if (!reward) throw new Error('Reward not found');
    await reward.destroy();
    await SystemEvent.create({
        adminId: admin.personId,
        userId: reward.userId,
        eventType: 'DAILY_REWARD_MANUAL_REJECT',
        description: 'Recompensa diaria rechazada manualmente',
        category: 'ADMIN'
    });
    return { message: 'Daily reward rejected' };
};

exports.getPayments = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'PAYMENT_ADMIN') throw new Error('Permission denied');
    return await Payment.findAll({
        include: ['user'],
        order: [['date', 'DESC']]
    });
};

exports.getPaymentDetail = async (adminId, paymentId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'PAYMENT_ADMIN') throw new Error('Permission denied');
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw new Error('Payment not found');
    const traces = await PaymentTrace.findAll({ where: { paymentId }, order: [['traceDate', 'ASC']] });
    await SystemEvent.create({
        adminId: admin.personId,
        eventType: 'PAYMENT_VIEWED',
        description: `Detalle de pago ${paymentId} consultado`,
        category: 'ADMIN'
    });
    return { payment, traces };
};

exports.getNotifications = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'NOTIF_ADMIN')
        throw new Error('Permission denied');

    return await Notification.findAll({
        order: [['createdAt', 'DESC']]
    });
};

exports.sendNotification = async (userId, title, message, type, createdBy) => {
    let admin = await Admin.findByPk(createdBy);
    if (admin.adminType !== 'NOTIF_ADMIN')
        throw new Error('Permission denied');
    await sendEmail({
        to: userId,
        subject: title,
        html: `<p>${message}</p>`
    });
    await createNotification({
        userId: userId,
        type: type,
        title: title,
        message: message,
        createdBy: createdBy
    });
    return { message: 'Notifications and emails sent.' }
}

exports.sendNotifications = async (title, message, type, createdBy) => {
    let admin = await Admin.findByPk(createdBy);
    if (admin.adminType !== 'NOTIF_ADMIN')
        throw new Error('Permission denied');
    let users = await AppUser.findAll();
    users.forEach( async (user) => {
        await sendEmail({
            to: user.personId,
            subject: title,
            html: `<p>${message}</p>`
        });
        await createNotification({
            userId: user.personId,
            type: type,
            title: title,
            message: message,
            createdBy: createdBy
        });
    });
}

exports.getEvents = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (admin.adminType !== 'EVENT_ADMIN') throw new Error('Permission denied');
    return await SystemEvent.findAll();
};

exports.getAdmins = async (adminId) => {
    let admin = await Admin.findByPk(adminId);
    if (!admin) throw new Error('Permission denied');
    return await Admin.findAll();
};

exports.getPermissionsByDepartment = async (department) => {
    const permissionsMap = {
        GAME: { canManageGames: true, canApproveRewards: true },
        PAYMENT: { canChargeUsers: true, canManagePlans: true },
        EVENT: { canCreateEvents: true, canManageEvents: true },
        NOTIF: { canSendNotifications: true, canManageNotifications: true }
    };
    return permissionsMap[department] || {};
};