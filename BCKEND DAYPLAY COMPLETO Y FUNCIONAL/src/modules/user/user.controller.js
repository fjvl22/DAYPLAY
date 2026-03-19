const service = require('./user.service');

async function getLeaderboard(req, res) {
    try {
        const userId = req.user.id;
        const gameId = parseInt(req.params.gameId);
        const sortBy = req.query.sortBy || 'score';
        if (!gameId) return res.status(400).json({ message: 'gameId required' });

        const leaderboard = await service.getLeaderboard(userId, gameId, sortBy);
        res.json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function registerMatch(req, res) {
    try {
        const userId = req.user.id;
        const { gameId } = req.body;
        const match = await service.createMatch(userId, gameId);
        res.json({ message: 'Match created', match });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function finishMatch(req, res) {
    try {
        const { matchId, score, extraData } = req.body;
        await service.finishMatch(matchId, score, extraData);
        res.json({ message: 'Match finished successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateStreak(req, res) {
    try {
        const userId = req.user.id;
        const { gameId } = req.body;
        const streak = await service.updateStreak(userId, gameId);
        res.json({ message: 'Streak updated', currentStreak: streak.currentStreak });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateLeaderboard(req, res) {
    try {
        const userId = req.user.id;
        const { gameId, score } = req.body;
        await service.updateLeaderboard(userId, gameId, score);
        res.json({ message: 'Leaderboard updated' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getGames(req, res) {
    try {
        const games = await service.getGames();
        res.json(games);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getHangmanWords(req, res) {
    try {
        const words = await service.getHangmanWords();
        res.json(words);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getWordleWords(req, res) {
    try {
        const words = await service.getWordleWords();
        res.json(words);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMathOperations(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const operations = await service.getMathOperations(page);
        res.json(operations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getLeaderboard,
    registerMatch,
    finishMatch,
    updateStreak,
    updateLeaderboard,
    getGames,
    getHangmanWords,
    getWordleWords,
    getMathOperations
};