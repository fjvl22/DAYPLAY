const router = require('express').Router();
const admin = require('./admin.controller');
const auth = require('../../middlewares/checkRole');

router.use(auth);

router.get('/users',admin.getUsers);
router.get('/users/pending',admin.getPendingUsers);
router.post('/users/approve',admin.approvePendingUser);
router.delete('/users/reject/:id',admin.rejectPendingUser);
router.put('/users/:id',admin.updateUser);
router.delete('/users/:id',admin.deleteUser);

router.get('/games',admin.getGames);
router.get('/games/hangman',admin.getHangmanWords);
router.get('/games/wordle',admin.getWordleWords);
router.get('/games/math',admin.getMathOperations);

router.post('/games/word',admin.insertGameWord);
router.post('/games/math',admin.insertMathOperation);

router.get('/games/canPlay',admin.canUserPlayToday);

router.get('/rewards',admin.getDailyRewardRequests);
router.post('/rewards/approve',admin.approveDailyReward);
router.delete('/rewards/:rewardId',admin.rejectDailyReward);

router.get('/payments',admin.getPayments);
router.get('/payments/:id',admin.getPaymentDetail);

router.get('/notifications',admin.getNotifications);

router.get('/events',admin.getEvents);

router.get('/admins',admin.getAdmins);

router.get('/permissions/:department',admin.getPermissionsByDepartment);

module.exports = router;