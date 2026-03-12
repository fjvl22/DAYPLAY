const router = require('express').Router();
const controller = require('./admin.controller');
const { authGuard } = require('../../middlewares/auth.guard');

/* =========================
   USERS
========================= */

router.get('/users', authGuard('USER_MANAGE'), controller.getUsers);
router.put('/users/:id', authGuard('USER_EDIT'), controller.updateUser);
router.delete('/users/:id', authGuard('USER_DELETE'), controller.deleteUser);

/* =========================
   PENDING USERS
========================= */

router.get('/pending-users', authGuard('USER_MANAGE'), controller.getPendingUsers);
router.post('/pending-users/:id/approve', authGuard('USER_CREATE'), controller.approvePendingUser);
router.delete('/pending-users/:id', authGuard('USER_DELETE'), controller.rejectPendingUser);

/* =========================
   GAMES
========================= */

router.get('/games', authGuard('GAME_MANAGE'), controller.getGames);
router.post('/games', authGuard('GAME_CREATE'), controller.createGame);
router.put('/games/:id', authGuard('GAME_EDIT'), controller.updateGame);
router.delete('/games/:id', authGuard('GAME_DELETE'), controller.deleteGame);

/* =========================
   DAILY REWARDS
========================= */

router.get('/daily-rewards', authGuard('DAILY_REWARD_MANAGE'), controller.getDailyRewardRequests);
router.post('/daily-rewards/:userId/approve', authGuard('DAILY_REWARD_MANAGE'), controller.approveDailyReward);
router.delete('/daily-rewards/:id', authGuard('DAILY_REWARD_MANAGE'), controller.rejectDailyReward);

/* =========================
   PAYMENTS
========================= */

router.get('/payments', authGuard('PAYMENT_MANAGE'), controller.getPayments);
router.get('/admin/payments/:id', authGuard('PAYMENT_MANAGE'), controller.getPaymentDetail);

/* =========================
   NOTIFICATIONS
========================= */

router.get('/notifications', authGuard('NOTIF_MANAGE'), controller.getNotifications);

/* =========================
   EVENTS
========================= */

router.get('/events', authGuard('EVENT_MANAGE'), controller.getEvents);

/* =========================
   ADMINS
========================= */

router.get('/admins', controller.getAdmins);

module.exports = router;
