const router = require('express').Router();
const controller = require('./user.controller');
const mw = require('../../middlewares');

router.use(mw.auth);
router.use(mw.loadUser);

router.get('/games', mw.requireUser, controller.getGames);

router.post('/match', mw.requirePureAppUser, controller.registerMatch);
router.post('/match/finish', mw.requirePureAppUser, controller.finishMatch);

router.post('/streak', mw.requirePureAppUser, controller.updateStreak);

router.post('/leaderboard', mw.requirePureAppUser, controller.updateLeaderboard);
router.get('/leaderboard/:gameId', mw.requirePureAppUser, controller.getLeaderboard);

router.get('/chapters', mw.requirePureAppUser, controller.getChapters);

router.get('/users', mw.requirePureAppUser, controller.getUsers);

module.exports = router;