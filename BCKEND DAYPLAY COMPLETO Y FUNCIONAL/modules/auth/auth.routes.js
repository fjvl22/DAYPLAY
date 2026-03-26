const router = require('express').Router();
const controller = require('./auth.controller');
const { authGuard } = require('../../middlewares/auth.guard');

router.post('/login', controller.login);
router.post('/register/admin', controller.adminRegistration);
router.post('/register/user', controller.userRegistration);

router.post('/logout', authGuard(), controller.logout);
router.delete('/delete-account', authGuard(), controller.deleteAccount);
router.put('/change-password', authGuard(), controller.changePassword);

router.get('/plan-types', authGuard(), controller.getPlanTypes);

module.exports = router;