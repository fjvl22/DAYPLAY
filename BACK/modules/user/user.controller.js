const service = require('./user.service');

async function getLeaderboard(req, res) {
    try {
        const userId = req.user.personId;
        const gameId = parseInt(req.params.gameId);
        const sortBy = req.query.sortBy || 'score';

        const result = await service.getLeaderboard(userId, gameId, sortBy);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function registerMatch(req, res) {
    try {
        const userId = req.user.personId;
        const { gameId } = req.body;

        const match = await service.createMatch(userId, gameId);
        res.json(match);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function finishMatch(req, res) {
    try {
        const { matchId, score, extraData } = req.body;

        const result = await service.finishMatch(matchId, score, extraData);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateStreak(req, res) {
    try {
        const userId = req.user.personId;
        const { gameId } = req.body;

        const streak = await service.updateStreak(userId, gameId);
        res.json(streak);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateLeaderboard(req, res) {
    try {
        const userId = req.user.personId;
        const { gameId, score } = req.body;

        await service.updateLeaderboard(userId, gameId, score);
        res.json({ message: 'ok' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getGames(req, res) {
    const games = await service.getGames();
    res.json(games);
}

async function getChapters(req, res) {
    try {
        const userId = req.user.personId;
        const chapters = await service.getAvailableChapters(userId);
        res.json({ chapters });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function getUsers(req, res) {
    const users = await service.getUsers();
    res.json(users);
}

module.exports = {
    getLeaderboard,
    registerMatch,
    finishMatch,
    updateStreak,
    updateLeaderboard,
    getGames,
    getChapters,
    getUsers
};