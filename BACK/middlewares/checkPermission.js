module.exports = (permission) => {
    return (req, res, next) => {
        if (!req.admin.permissions || !req.admin.permissions[permission]) {
            return res.status(403).json({ message: 'Insufficient permission' });
        }
        next();
    };
};