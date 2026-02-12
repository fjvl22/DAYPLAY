export const requireAppUser = (req, res, next) => {
    if (req.user.role === 'ADMIN') {
      return res.status(403).json({
        message: 'Admins no pueden acceder al ranking'
      });
    }
    next();
};