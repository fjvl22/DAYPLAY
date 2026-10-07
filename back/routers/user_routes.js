const express = require('express');

const router = express.Router();

const controller = require('../controllers/user_controller');

router.post("/register", controller.register);

module.exports = router;