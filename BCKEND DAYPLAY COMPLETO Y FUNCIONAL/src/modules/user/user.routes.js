const router = require('express').Router();
const controller = require('./user.controller');
const { authGuard } = require('../../middlewares/auth.guard');

router.get('/leaderboard/:gameId', authGuard(), controller.getLeaderboard);
router.post('/match', authGuard(), controller.registerMatch);
router.post('/match/finish', authGuard(), controller.finishMatch);
router.post('/streak', authGuard(), controller.updateStreak);
router.post('/leaderboard', authGuard(), controller.updateLeaderboard);
router.get('/games', authGuard(), controller.getGames);
router.get('/hangman/words', authGuard(), controller.getHangmanWords);
router.get('/wordle/words', authGuard(), controller.getWordleWords);
router.get('/operations', authGuard(), controller.getMathOperations);

module.exports = router;