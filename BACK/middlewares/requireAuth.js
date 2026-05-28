module.exports = function requireAuth(req, res, next) {
  if (!req.user?.personId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
};