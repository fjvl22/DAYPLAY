const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: 'Required token' });

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.admin = decoded;
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};