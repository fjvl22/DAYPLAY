module.exports = function requirePureAppUser(req, res, next) {
  const { admin, appUser, pending } = req.context || {};

  if (!req.user?.personId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (!appUser) {
    return res.status(403).json({ message: 'AppUser required' });
  }

  if (admin) {
    return res.status(403).json({ message: 'Admins not allowed' });
  }

  if (pending) {
    return res.status(403).json({ message: 'Pending users not allowed' });
  }

  next();
};