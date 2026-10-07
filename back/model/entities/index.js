const sequelize = require('../config/database');

const Person = require('./Person');
const UserPlan = require('./UserPlan');
const UserPending = require('./UserPending');
const Admin = require('./Admin');
const AppUser = require('./AppUser');
const Game = require('./Game');
const GameWord = require('./GameWord');
const GameMatch = require('./GameMatch');
const Streak = require('./Streak');
const Leaderboard = require('./Leaderboard');
const Payment = require('./Payment');
const PaymentTrace = require('./PaymentTrace');
const Notification = require('./Notification');
const Story = require('./Story');
const Chapter = require('./Chapter');
const StoryAccess = require('./StoryAccess');
const DailyGameReward = require('./DailyGameReward');
const UserGame = require('./UserGame');
const SystemEvent = require('./SystemEvent');
const TokenBlacklist = require('./TokenBlacklist');
const MathOperation = require('./MathOperation');
const MathOption = require('./MathOption');
const RegistrationPending = require('./RegistrationPending');
const AdminInvitation = require('./AdminInvitation');

const db = {};

db.Person = Person(sequelize);
db.UserPlan = UserPlan(sequelize);
db.UserPending = UserPending(sequelize);
db.Admin = Admin(sequelize);
db.AppUser = AppUser(sequelize);
db.Game = Game(sequelize);
db.GameWord = GameWord(sequelize);
db.GameMatch = GameMatch(sequelize);
db.Streak = Streak(sequelize);
db.Leaderboard = Leaderboard(sequelize);
db.Payment = Payment(sequelize);
db.PaymentTrace = PaymentTrace(sequelize);
db.Notification = Notification(sequelize);
db.Story = Story(sequelize);
db.Chapter = Chapter(sequelize);
db.StoryAccess = StoryAccess(sequelize);
db.DailyGameReward = DailyGameReward(sequelize);
db.UserGame = UserGame(sequelize);
db.SystemEvent = SystemEvent(sequelize);
db.TokenBlacklist = TokenBlacklist(sequelize);
db.MathOperation = MathOperation(sequelize);
db.MathOption = MathOption(sequelize);
db.RegistrationPending = RegistrationPending(sequelize);
db.AdminInvitation = AdminInvitation(sequelize);

Object.values(db).forEach((model) => {
    if (typeof model.associate === 'function') {
        model.associate(db);
    }
});

db.sequelize = sequelize;

module.exports = db;