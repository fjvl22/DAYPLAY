const router = require('express').Router();
const controller = require('./payment.controller');
const mw = require('../../middlewares');
const stripeWebhook = require('./webhook');

router.post('/create-intent', mw.auth, mw.loadUser, mw.requireAdmin, controller.createIntent);

router.post('/webhook', require('express').raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;