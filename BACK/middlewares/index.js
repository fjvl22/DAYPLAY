// middlewares/index.js

module.exports = {
  auth: require('./auth'),
  loadUser: require('./loadUser'),
  requireAuth: require('./requireAuth'),
  requireAdmin: require('./requireAdmin'),
  requireUser: require('./requireUser'),
  requireAdminDepartment: require('./requireAdminDepartment'),
  requirePureAppUser: require('./requirePureAppUser')
};