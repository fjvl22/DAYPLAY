const router = require('express').Router();
const admin = require('./admin.controller');

const {
  auth,
  loadUser,
  requireAdmin,
  requireAdminDepartment
} = require('../../middlewares');

// base
router.use(auth);
router.use(loadUser);
router.use(requireAdmin);

// USERS
router.get('/users', requireAdminDepartment(['GAME', 'PAYMENT', 'NOTIF']), admin.getUsers);
router.get('/users/pending', requireAdminDepartment(['GAME']), admin.getPendingUsers);
router.post('/users/approve', requireAdminDepartment(['PAYMENT']), admin.approvePendingUser);
router.delete('/users/reject/:id', requireAdminDepartment(['GAME']), admin.rejectPendingUser);
router.put('/users/:id', requireAdminDepartment(['GAME', 'PAYMENT']), admin.updateUser);
router.delete('/users/:id', requireAdminDepartment(['GAME']), admin.deleteUser);

// GAMES
router.get('/games', requireAdminDepartment(['GAME']), admin.getGames);
router.get('/games/hangman', requireAdminDepartment(['GAME']), admin.getHangmanWords);
router.get('/games/wordle', requireAdminDepartment(['GAME']), admin.getWordleWords);
router.get('/games/math', requireAdminDepartment(['GAME']), admin.getMathOperations);

router.post('/games/word', requireAdminDepartment(['GAME']), admin.insertGameWord);
router.post('/games/operation', requireAdminDepartment(['GAME']), admin.insertMathOperation);
router.get('/rewards', requireAdminDepartment(['GAME']), admin.getRewards);
router.post('/rewards/:userId/approve', requireAdminDepartment(['GAME']), admin.approveReward);
router.post('/rewards/:userId/reject', requireAdminDepartment(['GAME']), admin.rejectReward);

// EVENTS
router.get('/events', requireAdminDepartment(['EVENT']), admin.getAllEvents);
router.get('/admins', admin.getAdmins);

router.get('/permissions/:department', admin.getPermissionsByDepartment);

// PAYMENTS
router.get('/payments', requireAdminDepartment(['PAYMENT']), admin.getAllPayments);
router.get('/payments/:id', requireAdminDepartment(['PAYMENT']), admin.getPaymentById);
router.get('/payments/:id/traces', requireAdminDepartment(['PAYMENT']), admin.getPaymentTraces);

// NOTIFICATIONS
router.post('/notifications/user', requireAdminDepartment(['NOTIF']), admin.sendToUser);
router.post('/notifications/all', requireAdminDepartment(['NOTIF']), admin.sendToAllUsers);

module.exports = router;