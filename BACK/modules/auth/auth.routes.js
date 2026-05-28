const router = require('express').Router();
const controller = require('./auth.controller');
const mw = require('../../middlewares');

router.post('/login', controller.login);
router.post('/register/admin', controller.adminRegistration);
router.post('/register/user', controller.userRegistration);

router.post('/logout', mw.auth, mw.loadUser, controller.logout);

router.delete(
    '/delete-account',
    mw.auth,
    mw.loadUser,
    controller.deleteAccount
);

router.put(
    '/change-password',
    mw.auth,
    mw.loadUser,
    controller.changePassword
);

router.get(
    '/plan-types',
    mw.auth,
    mw.loadUser,
    controller.getPlanTypes
);

module.exports = router;