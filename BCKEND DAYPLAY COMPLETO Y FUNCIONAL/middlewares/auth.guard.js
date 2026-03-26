const jwt = require('jsonwebtoken');
const { TokenBlacklist } = require('../models/tokenBlacklist');

exports.authGuard = () => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return next(new Error('Token missing'));
            }
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const blacklisted = await TokenBlacklist.findOne({ where: { token } });
            if (blacklisted) {
                return next(new Error('Token invalidated'));
            }
            req.user = decoded;
            req.token = token;
            next();
        } catch (error) {
            next(new Error('Invalid or expired token'));
        }
    };
};