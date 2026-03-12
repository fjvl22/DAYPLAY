const { Op } = require('sequelize');
const sequelize = require('../../config/database');

const Person = require('../../models/person');
const Admin = require('../../models/admin');
const AppUser = require('../../models/appUser');
const UserPending = require('../../models/userPending');
const Game = require('../../models/game');
const GameMatch = require('../../models/gameMatch');
const DailyGameReward = require('../../models/dailyGameReward');
const Story = require('../../models/story');
const StoryAccess = require('../../models/storyAccess');
const Chapter = require('../../models/chapter');
const Payment = require('../../models/payment');
const PaymentTrace = require('../../models/paymentTrace');
const Notification = require('../../models/notification');
const SystemEvent = require('../../models/systemEvent');
const UserPlan = require('../../models/userPlan');

const { chargeUser } = require('../../payment/payment.service');
const { sendEmail } = require('../../services/email.service');
const { createNotification } = require('../../services/notification.service');

exports.getUsers = async (admin) => {
    if (!['GAME_ADMIN', 'PAYMENT_ADMIN'].includes(admin.adminType)) throw new Error('Permission denied');
    return await AppUser.findAll({ include: Person });
};

exports.getPendingUsers = async (admin) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await UserPending.findAll({ include: Person });
};

exports.approvePendingUser = async (admin, pendingUserId, plan) => {
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

exports.rejectPendingUser = async (admin, pendingUserId) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const pending = await UserPending.findByPk(pendingUserId);
    if (!pending) throw new Error('Pending user not found');
    await pending.destroy();
    const person = await Person.findByPk(pendingUserId);
    await person.destroy();
    await SystemEvent.create({
        adminId: admin.personId,
        userId: pending.personId,
        eventType: 'USER_REJECTED',
        description: 'Usuario rechazado y eliminado',
        category: 'ADMIN'
    });
    return { message: 'User rejected and removed from pending list' };
};

exports.updateUser = async (admin, id, data) => {
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
    await SystemEvent.create({
        adminId: admin.personId,
        userId: id,
        eventType: 'USER_UPDATED',
        description: 'Datos de usuario actualizados',
        category: 'ADMIN'
    });
    return user;
};

exports.deleteUser = async (admin, id) => {
    if (!admin.adminType=='GAME_ADMIN') throw new Error('Permission denied');
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

exports.getGames = async (admin) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await Game.findAll();
};

exports.createGame = async (admin, data) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const { name, description, url, type, config } = data;
    const game = await Game.create({
        name,
        description,
        url,
        type,
        config,
        active: true
    });
    await SystemEvent.create({
        adminId: admin.personId,
        eventType: 'GAME_CREATED',
        description: `Juego creado: ${data.name}`,
        category: 'ADMIN'
    });
    return { message: 'Game correctly created' };
};

exports.updateGame = async (admin, id, data) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const game = await Game.findByPk(id);
    if (!game) throw new Error('Game not found');
    await game.update(data);
    await SystemEvent.create({
        adminId: admin.personId,
        eventType: 'GAME_UPDATED',
        description: `Juego actualizado ID ${id}`,
        category: 'ADMIN'
    });
    return { message: 'Game correctly updated' };
};

exports.deleteGame = async (admin, id) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const game = await Game.findByPk(id);
    if (!game) throw new Error('Game not found');
    await game.destroy();
    await SystemEvent.create({
        adminId: admin.personId,
        eventType: 'GAME_DELETED',
        description: `Juego eliminado ID ${id}`,
        category: 'ADMIN'
    });
    return { message: 'Game correctly deleted' };
};

exports.canUserPlayToday = async (admin, userId, gameId) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(13,59,59,999);
    const match = await GameMatch.findOne({
        where: {
            userId,
            gameId,
            date: { [Op.between]: [todayStart, todayEnd] }
        }
    });
    return { canPlay: !match };
};

exports.getDailyRewardRequests = async (admin) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    return await DailyGameReward.findAll({ include: Person });
};

exports.approveDailyReward = async (admin, userId, ipAddress = null) => {
    if (!admin || admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const dailyGameReward = await DailyGameReward.findOne({ where: { userId } });
    if (!dailyGameReward) return { approved: false, message: 'No pending daily reward' };
    const games = await Game.findAll({ attributes: ['id'] });
    const gameIds = games.map(g => g.id);
    if (!gameIds.length) throw new Error('No games configured in system');
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate()-1);
    const yesterdayEnd = new Date(todayEnd);
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
    const isEligible = (wonYesterday === gameIds.length) && (wonToday === gameIds.length);
    const currentMonth = todayStart.toLocaleString('default', { month: 'long' });
    const story = await Story.findOne({ where: { monthYear: currentMonth } });
    if (!story) throw new Error('Story not found for current month');
    const chapter = await Chapter.findOne({
        where: {
            storyId: story.id,
            dayNumber: todayStart.getDate()
        }
    });
    if (!chapter) throw new Error('Chapter not found for today');
    const user = await AppUser.findByPk(userId, { include: [Plan] });
    const tomorrowMidnight = new Date(todayStart);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate()+1);
    let revokeDate = null;
    let notes = 'Daily chapter auto-approved';
    let plan = await Plan.findByPk(user.planId);
    if (isEligible && plan.planType === 'BASIC') {
        revokeDate = tomorrowMidnight;
        notes += ' (expires at midnight)';
    }
    const existingAccess = await StoryAccess.findOne({
        where: { storyId: story.id, userId }
    });
    if (!existingAccess) {
        await StoryAccess.create({
            storyId: story.id,
            userId,
            grantedBy: admin.personId,
            accessGranted: isEligible,
            grantDate: isEligible ? new Date() : null,
            revokeDate,
            notes: isEligible ? notes : 'Daily chapter auto-rejected'
        });
    }
    await dailyGameReward.destroy();
    if (isEligible) {
        let extraMessage = '';
        if (plan.planType === 'BASIC') {
            extraMessage = `
                <p><strong>⚠ IMPORTANTE:</strong>
                Al tener plan básico, el acceso estará disponible
                solo hasta las 00:00.</p>
            `;
        }
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
            title: plan.planType === 'BASIC'
            ? `Capítulo ${chapter.title} disponible hasta las 00:00`
            : `Ya puedes leer el capítulo ${chapter.title}`,
            type: 'DAILY_REWARD'
        });
        await SystemEvent.create({
            adminId: admin.personId,
            userId,
            eventType: 'DAILY_REWARD_GRANTED',
            description: `Capítulo ${chapter.title} concedido (${plan.planType})`,
            category: 'ADMIN',
            ipAddress: ipAddress
        });
    } else {
        await SystemEvent.create({
            adminId: admin.personId,
            userId,
            eventType: 'DAILY_REWARD_REJECTED',
            description: 'Usuario no cumplía requisitos',
            category: 'ADMIN'
        });
    }
};

exports.rejectDailyReward = async (admin, rewardId) => {
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

exports.getPayments = async (admin) => {
    if (admin.adminType !== 'PAYMENT_ADMIN') throw new Error('Permission denied');
    return await Payment.findAll({
        include: ['user'],
        order: [['date', 'DESC']]
    });
};

exports.paymentDetail = async (admin, paymentId) => {
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

exports.getNotifications = async (admin) => {
    if (admin.adminType !== 'NOTIF_ADMIN')
        throw new Error('Permission denied');

    return await Notification.findAll({
        order: [['createdAt', 'DESC']]
    });
};

exports.getEvents = async (admin) => {
    if (admin.adminType !== 'EVENT_ADMIN') throw new Error('Permission denied');
    return await SystemEvent.findAll();
};

exports.getAdmins = async (admin) => {
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

exports.getActiveGames = async (admin, id) => {
    if (admin.adminType !== 'GAME_ADMIN') throw new Error('Permission denied');
    const game = await Game.findByPk(id);
    return game;
};