const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const stripeWebhook = require('./webhook');

router.post('/create-intent', controller.createIntent);
router.post('/webhook', express.json(), stripeWebhook);

module.exports = router;