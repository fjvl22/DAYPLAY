module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup/globalSetup.js'],
  testTimeout: 30000,
  clearMocks: true,
  restoreMocks: true
};