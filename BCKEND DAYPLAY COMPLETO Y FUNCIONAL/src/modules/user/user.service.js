const Leaderboard = require('../../models/leaderboard');
const Person = require('../../models/person');
const AppUser = require('../../models/appUser');
const UserPlan = require('../../models/userPlan');
const GameMatch = require('../../models/gameMatch');
const UserGame = require('../../models/userGame');
const DailyGameReward = require('../../models/dailyGameReward');
const GameWord = require('../../models/gameWord');
const MathOperation = require('../../models/mathOperation');
const MathOption = require('../../models/mathOption');
const sequelize = require('../../config/database');
const Streak = require('../../models/streak');
const { Op } = require('sequelize');
const Game = require('../../models/game');
const SystemEvent = require('../../models/systemEvent');

function getToday() {
    const today = new Date();
    today.setHours(0,0,0,0);
    return today;
}

function getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0);
    return yesterday;
}

function getTomorrow() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0,0,0,0);
    return tomorrow;
}

// ======================= LEADERBOARD =======================

async function getLeaderboard(userId, gameId, sortBy = 'score') {
    const user = await AppUser.findByPk(userId, { include: { model: UserPlan, attributes: ['planType'] } });
    if (!user) throw new Error('User not found');

    const planType = user.UserPlan.planType;
    const orderField = sortBy === 'date' ? ['lastUpdate', 'DESC'] : ['totalPoints', 'DESC'];

    if (planType === 'BASIC') {
        const ownScore = await Leaderboard.findOne({ where: { userId, gameId } });
        const person = await Person.findByPk(userId);

        await SystemEvent.create({
            userId,
            eventType: 'LEADERBOARD_VIEWED',
            description: `Ranking consultado juego ${gameId}`,
            category: 'USER'
        });

        return {
            type: 'BASIC',
            data: ownScore ? [{ nickname: person.nickname, score: ownScore.totalPoints, date: ownScore.lastUpdate }] : []
        };
    }

    const ranking = await Leaderboard.findAll({
        where: { gameId },
        order: [orderField],
        include: { model: AppUser, include: { model: Person, attributes: ['nickname'] } }
    });

    await SystemEvent.create({
        userId,
        eventType: 'LEADERBOARD_VIEWED',
        description: `Ranking consultado juego ${gameId}`,
        category: 'USER'
    });

    return {
        type: 'PREMIUM',
        data: ranking.map(r => ({
            nickname: r.AppUser.Person.nickname,
            score: r.totalPoints,
            date: r.lastUpdate
        }))
    };
}

async function updateLeaderboard(userId, gameId, score) {
    const row = await Leaderboard.findOne({ where: { userId, gameId } });
    if (!row) {
        await Leaderboard.create({ userId, gameId, totalPoints: score, lastUpdate: new Date() });
    } else {
        row.totalPoints = score;
        row.lastUpdate = new Date();
        await row.save();
    }
    return { message: 'Leaderboard updated' };
}

// ======================= MATCH =======================

async function createMatch(userId, gameId) {
    const match = await GameMatch.create({ userId, gameId, score: 0, extraData: '' });
    return match;
}

async function finishMatch(matchId, score, extraData) {
    const transaction = await sequelize.transaction();
    try {
        const match = await GameMatch.findByPk(matchId, { transaction });
        if (!match) throw new Error('Match not found');

        match.score = score;
        match.extraData = extraData;
        await match.save({ transaction });

        const game = await Game.findByPk(match.gameId, { transaction });

        await SystemEvent.create({
            userId: match.userId,
            eventType: 'GAME_PLAYED',
            description: `Partida registrada en juego ${game.name} con puntuación ${score}`,
            category: 'USER',
            transaction
        });

        await UserGame.update(
            { active: 0 },
            { where: { userId: match.userId, gameId: match.gameId }, transaction }
        );

        const matchesToday = await GameMatch.findAll({
            where: { userId: match.userId, date: { [Op.gte]: getToday(), [Op.lt]: getTomorrow() } },
            transaction
        });

        const uniqueGamesToday = [...new Set(matchesToday.map(m => m.gameId))];

        if (uniqueGamesToday.length === 4) {
            const matchesYesterday = await GameMatch.findAll({
                where: { userId: match.userId, date: { [Op.gte]: getYesterday(), [Op.lt]: getToday() } },
                transaction
            });
            const uniqueGamesYesterday = [...new Set(matchesYesterday.map(m => m.gameId))];
            if (uniqueGamesYesterday.length === 4) {
                await DailyGameReward.findOrCreate({
                    where: { userId: match.userId, rewardDate: getToday() },
                    defaults: { totalScore: score },
                    transaction
                });
                await SystemEvent.create({
                    userId: match.userId,
                    eventType: 'DAILY_REWARD_UNLOCKED',
                    description: 'Usuario desbloqueó recompensa diaria',
                    category: 'USER',
                    transaction
                });
            }
        }

        await transaction.commit();
        return { message: 'Match finished successfully' };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

// ======================= STREAK =======================

async function updateStreak(userId, gameId) {
    const today = getToday();
    const yesterday = getYesterday();
    let streak = await Streak.findOne({ where: { userId, gameId } });

    if (!streak) {
        streak = await Streak.create({ userId, gameId, currentStreak: 1, lastDate: today });
        return streak;
    }

    const lastDate = new Date(streak.lastDate);
    lastDate.setHours(0,0,0,0);

    if (lastDate.getTime() === today.getTime()) return streak;

    if (lastDate.getTime() === yesterday.getTime()) {
        streak.currentStreak += 1;
        streak.lastDate = today;
        await streak.save();
        await SystemEvent.create({
            userId,
            eventType: 'STREAK_UPDATED',
            description: `Nueva racha: ${streak.currentStreak}`,
            category: 'USER'
        });
        return streak;
    }

    streak.currentStreak = 1;
    streak.lastDate = today;
    await streak.save();
    await SystemEvent.create({
        userId,
        eventType: 'STREAK_RESET',
        description: 'Racha reiniciada',
        category: 'USER'
    });

    return streak;
}

// ======================= GAMES =======================

async function getGames() {
    return await Game.findAll();
}

async function getHangmanWords() {
    return await GameWord.findAll({ where: { gameId: 1, active: true }, attributes: ['id','word','language'], order: [['id','ASC']] });
}

async function getWordleWords() {
    return await GameWord.findAll({ where: { gameId: 4, active: true }, attributes: ['id','word','language'], order: [['id','ASC']] });
}

async function getMathOperations(page = 1) {
    const limit = 10;
    const offset = (page - 1) * limit;
    return await MathOperation.findAll({
        include: [{ model: MathOption, attributes: ['id','optionValue'], required: false, order: [['id','ASC']] }],
        order: [['id','ASC']],
        limit,
        offset
    });
}

module.exports = {
    getLeaderboard,
    createMatch,
    finishMatch,
    updateStreak,
    updateLeaderboard,
    getGames,
    getHangmanWords,
    getWordleWords,
    getMathOperations
};