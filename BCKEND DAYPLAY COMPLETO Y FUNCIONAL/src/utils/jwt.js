const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.generateToken = (payload) => {return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '8h' });};

exports.verifyToken = (token) => {return jwt.verify(token, env.JWT_SECRET);};