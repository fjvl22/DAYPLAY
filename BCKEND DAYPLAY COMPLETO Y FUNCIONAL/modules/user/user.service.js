const sequelize = require('../../config/database');
const { Op } = require('sequelize');
const { Leaderboard } = require('../../models');
const { Person } = require('../../models');
const { AppUser } = require('../../models');
const { UserPlan } = require('../../models');
const { GameMatch } = require('../../models');
const { UserGame } = require('../../models');
const { DailyGameReward } = require('../../models');
const { GameWord } = require('../../models');
const { MathOperation } = require('../../models');
const { MathOption } = require('../../models');
const { Streak } = require('../../models');
const { Game } = require('../../models');
const { SystemEvent } = require('../../models');
const { Story } = require('../../models');
const { Chapter } = require('../../models');
const { StoryAccess } = require('../../models');

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
    const today = getToday();
    const possibleTodayMatch = await GameMatch.findOne({ where: { userId, gameId, date: today } });
    if (possibleTodayMatch) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setHours(24, 0, 0, 0);
        const diffMs = tomorrow - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        throw new Error(`You can not play a game twice a day. You can play again in ${hours} hours, ${minutes} minutes and ${seconds} seconds.`);
    }
    const todayMatch = await GameMatch.create({
        userId,
        gameId,
        date: today,
        score: 0,
        data: {}
    });
    return todayMatch;
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
        const matchesYesterday = await GameMatch.findAll({
            where: { userId: match.userId, date: { [Op.gte]: getYesterday(), [Op.lt]: getToday() } },
            transaction
        });
        const uniqueGamesYesterday = [...new Set(matchesYesterday.map(m => m.gameId))];
        const isFirstDay = matchesYesterday.length === 0;
        const isLastDayOfMonth = (() => {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.getDate() === 1;
        })();
        if (uniqueGamesToday.length === 4 && (uniqueGamesYesterday.length === 4 || isFirstDay || isLastDayOfMonth)) {
            const [reward, created] = await DailyGameReward.findOrCreate({
                where: { userId: match.userId, rewardDate: getToday() },
                defaults: { totalScore: matchesToday.reduce((sum, m) => sum + m.score, 0) },
                transaction
            });
            if (created) {
                let description = 'Capítulo diario desbloqueado';
                if (isFirstDay) description = 'Inicio de la historia desbloqueado';
                if (isLastDayOfMonth) description = 'Último día: todos los capítulos restantes desbloqueados';
                await SystemEvent.create({
                    userId: match.userId,
                    eventType: 'DAILY_REWARD_UNLOCKED',
                    description,
                    category: 'USER',
                    transaction
                });
                if (isLastDayOfMonth) {
                    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
                    const story = await Story.findOne({ where: { monthYear: currentMonth } });
                    if (story) {
                        const chapters = await Chapter.findAll({ where: { storyId: story.id } });
                        for (const chapter of chapters) {
                            await StoryAccess.findOrCreate({
                                where: { storyId: story.id, userId, accessGranted: true },
                                defaults: {
                                    grantedBy: 0,
                                    accessGranted: true,
                                    grantDate: new Date(),
                                    notes: 'Desbloqueado último día del mes'
                                },
                                transaction
                            });
                        }
                    }
                }
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

async function getAvailableChapters(userId) {
    const accessRecords = await StoryAccess.findAll({
        where: { userId, accessGranted: true },
        include: [
            {
                model: Story,
                include: [
                    {
                        model: Chapter,
                        attributes: ['id', 'dayNumber', 'title', 'unlockCondition'],
                        order: [['dayNumber', 'ASC']]
                    }
                ]
            }
        ]
    });
    const chapters = [];
    for(const access of accessRecords) {
        if (access.Story && access.Story.Chapters) {
            for (const chapter of access.Story.Chapters) {
                chapters.push({
                    storyId: access.storyId,
                    storyTitle: access.Story.title,
                    chapterId: chapter.id,
                    chapterTitle: chapter.title,
                    dayNumber: chapter.dayNumber,
                    unlockCondition: chapter.unlockCondition,
                    grantedBy: access.grantedBy,
                    grantDate: access.grantDate
                });
            }
        }
    }
    chapters.sort((a,b) => a.storyId - b.storyId || a.dayNumber - b.dayNumber);
    return chapters;
}

async function getUsers() {
    return AppUser.findAll();
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
    getMathOperations,
    getAvailableChapters,
    getUsers
};