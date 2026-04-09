const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./admin')(sequelize, DataTypes);
const AppUser = require('./appUser')(sequelize, DataTypes);
const BankCard = require('./bankCard')(sequelize, DataTypes);
const BankEntity = require('./bankEntity')(sequelize, DataTypes);
const Chapter = require('./chapter')(sequelize, DataTypes);
const DailyGameReward = require('./dailyGameReward')(sequelize, DataTypes);
const Game = require('./game')(sequelize, DataTypes);
const GameMatch = require('./gameMatch')(sequelize, DataTypes);
const GameWord = require('./gameWord')(sequelize, DataTypes);
const Leaderboard = require('./leaderboard')(sequelize, DataTypes);
const MathOperation = require('./mathOperation')(sequelize, DataTypes);
const MathOption = require('./mathOption')(sequelize, DataTypes);
const Notification = require('./notification')(sequelize, DataTypes);
const Payment = require('./payment')(sequelize, DataTypes);
const PaymentTrace = require('./paymentTrace')(sequelize, DataTypes);
const Person = require('./person')(sequelize, DataTypes);
const Story = require('./story')(sequelize, DataTypes);
const StoryAccess = require('./storyAccess')(sequelize, DataTypes);
const Streak = require('./streak')(sequelize, DataTypes);
const SystemEvent = require('./systemEvent')(sequelize, DataTypes);
const TokenBlacklist = require('./tokenBlacklist')(sequelize, DataTypes);
const UserGame = require('./userGame')(sequelize, DataTypes);
const UserPending = require('./userPending')(sequelize, DataTypes);
const UserPlan = require('./userPlan')(sequelize, DataTypes);

const models = {
    Admin,
    AppUser,
    BankCard,
    BankEntity,
    Chapter,
    DailyGameReward,
    Game,
    GameMatch,
    GameWord,
    Leaderboard,
    MathOperation,
    MathOption,
    Notification,
    Payment,
    PaymentTrace,
    Person,
    Story,
    StoryAccess,
    Streak,
    SystemEvent,
    TokenBlacklist,
    UserGame,
    UserPending,
    UserPlan
};

Object.values(models).forEach(model => {
    if (model.associate) {
        model.associate(models);
    }
});

module.exports = {
    sequelize,
    ...models
};