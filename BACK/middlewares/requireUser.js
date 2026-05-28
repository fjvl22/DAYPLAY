module.exports = function requireUser(req, res, next) {
  const { appUser, pending } = req.context || {};

  if (!req.user?.personId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!appUser && !pending) {
    return res.status(403).json({ message: 'User or pending user required' });
  }

  next();
};