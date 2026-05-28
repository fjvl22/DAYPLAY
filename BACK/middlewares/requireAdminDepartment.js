module.exports = function requireAdminDepartment(departments = []) {
  return (req, res, next) => {
    
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin required' });
    }

    const department = req.user?.department;

    if (!department) {
      return res.status(403).json({ message: 'Missing department in token' });
    }

    if (!departments.includes(department)) {
      return res.status(403).json({ message: 'Invalid department' });
    }

    next();
  };
};