const express = require('express');

const router = express.Router();

const controller = require('../controllers/registration_controller');

router.post("/confirm", controller.confirmRegistration);

module.exports = router;