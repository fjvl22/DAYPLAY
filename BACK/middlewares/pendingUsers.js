exports.activeUserGuard = (req, res, next) => {

    if (req.user.role === 'USER' && req.user.status === 'PENDING') {
        return res.status(403).json({ message: 'Account pending approval' });
    }

    next();
};
