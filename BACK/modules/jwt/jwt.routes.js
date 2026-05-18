const express = require('express');
const router = express.Router();

const jwtController = require('./jwt.controller');

router.post('/refresh', jwtController.refreshToken);

module.exports = router;