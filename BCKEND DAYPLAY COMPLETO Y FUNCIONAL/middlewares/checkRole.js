module.exports = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.adminType)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        next();
    };
};