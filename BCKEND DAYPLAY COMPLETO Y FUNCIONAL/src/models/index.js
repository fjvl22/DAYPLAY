// models/index.js
import Person from "./person.js";
import AppUser from "./app_user.js";
import Admin from "./admin.js";
import UserPending from "./user_pending.js";
import BankEntity from "./bank_entity.js";
import BankCard from "./bank_card.js";
import Game from "./game.js";
import GameWord from "./game_word.js";
import MathOperation from "./math_operation.js";
import MathOption from "./math_option.js";
import GameMatch from "./game_match.js";
import DailyGameReward from "./daily_game_reward.js";
import Streak from "./streak.js";
import Leaderboard from "./leaderboard.js";
import Payment from "./payment.js";
import PaymentTrace from "./payment_trace.js";
import Notification from "./notification.js";
import Story from "./story.js";
import Chapter from "./chapter.js";
import StoryAccess from "./story_access.js";
import SystemEvent from "./system_event.js";
import UserGame from "./user_game.js";

// NUEVO MODELO
import Plan from "./plan.js";

/* =====================
   PERSON / USER / ADMIN
===================== */
Person.hasOne(AppUser, { foreignKey: "PERSON_ID", as: "personAppUserProfile" });
AppUser.belongsTo(Person, { foreignKey: "PERSON_ID", as: "appUserPersonDetails" });

Person.hasOne(Admin, { foreignKey: "PERSON_ID", as: "personAdminProfile" });
Admin.belongsTo(Person, { foreignKey: "PERSON_ID", as: "adminPersonDetails" });

UserPending.belongsTo(AppUser, { foreignKey: "PERSON_ID", as: "pendingUserRef" });
AppUser.hasOne(UserPending, { foreignKey: "PERSON_ID", as: "appUserPendingRequest" });

/* =====================
   BANK ENTITY / BANK CARD
===================== */
BankCard.belongsTo(BankEntity, { foreignKey: "BANK_ENTITY_ID", as: "cardBankEntity" });
BankEntity.hasMany(BankCard, { foreignKey: "BANK_ENTITY_ID", as: "bankEntityCards" });

BankCard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "cardOwnerUser" });
AppUser.hasMany(BankCard, { foreignKey: "USER_ID", as: "appUserBankCards" });

/* =====================
   GAMES
===================== */
GameWord.belongsTo(Game, { foreignKey: "GAME_ID", as: "wordGameRef" });
Game.hasMany(GameWord, { foreignKey: "GAME_ID", as: "gameWordsList" });

MathOperation.belongsTo(Game, { foreignKey: "GAME_ID", as: "operationGameRef" });
Game.hasMany(MathOperation, { foreignKey: "GAME_ID", as: "gameOperations" });

MathOption.belongsTo(MathOperation, { foreignKey: "OPERATION_ID", as: "optionOperationRef" });
MathOperation.hasMany(MathOption, { foreignKey: "OPERATION_ID", as: "operationOptions" });

GameMatch.belongsTo(AppUser, { foreignKey: "USER_ID", as: "matchPlayerUser" });
AppUser.hasMany(GameMatch, { foreignKey: "USER_ID", as: "appUserGameMatches" });

GameMatch.belongsTo(Game, { foreignKey: "GAME_ID", as: "matchGameRef" });
Game.hasMany(GameMatch, { foreignKey: "GAME_ID", as: "gameMatchList" });

DailyGameReward.belongsTo(AppUser, { foreignKey: "USER_ID", as: "rewardUserRef" });
AppUser.hasMany(DailyGameReward, { foreignKey: "USER_ID", as: "appUserDailyRewards" });

Streak.belongsTo(AppUser, { foreignKey: "USER_ID", as: "streakUserRef" });
AppUser.hasMany(Streak, { foreignKey: "USER_ID", as: "appUserStreaks" });

Streak.belongsTo(Game, { foreignKey: "GAME_ID", as: "streakGameRef" });
Game.hasMany(Streak, { foreignKey: "GAME_ID", as: "gameStreaksList" });

Leaderboard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "leaderboardUserRef" });
AppUser.hasMany(Leaderboard, { foreignKey: "USER_ID", as: "appUserLeaderboards" });

Leaderboard.belongsTo(Game, { foreignKey: "GAME_ID", as: "leaderboardGameRef" });
Game.hasMany(Leaderboard, { foreignKey: "GAME_ID", as: "gameLeaderboardsList" });

/* =====================
   PAYMENTS
===================== */
Payment.belongsTo(AppUser, { foreignKey: "USER_ID", as: "paymentPayerUser" });
AppUser.hasMany(Payment, { foreignKey: "USER_ID", as: "appUserPayments" });

PaymentTrace.belongsTo(Payment, { foreignKey: "PAYMENT_ID", as: "tracePaymentRef" });
Payment.hasMany(PaymentTrace, { foreignKey: "PAYMENT_ID", as: "paymentTracesList" });

PaymentTrace.belongsTo(Admin, { foreignKey: "UPDATED_BY", as: "traceUpdatedByAdmin" });
Admin.hasMany(PaymentTrace, { foreignKey: "UPDATED_BY", as: "adminPaymentTraces" });

/* =====================
   NOTIFICATIONS
===================== */
Notification.belongsTo(AppUser, { foreignKey: "USER_ID", as: "notificationTargetUser" });
AppUser.hasMany(Notification, { foreignKey: "USER_ID", as: "appUserNotifications" });

Notification.belongsTo(Admin, { foreignKey: "CREATED_BY", as: "notificationCreatedByAdmin" });
Admin.hasMany(Notification, { foreignKey: "CREATED_BY", as: "adminCreatedNotifications" });

/* =====================
   STORIES / CHAPTERS / STORY_ACCESS
===================== */
Chapter.belongsTo(Story, { foreignKey: "STORY_ID", as: "chapterStoryRef" });
Story.hasMany(Chapter, { foreignKey: "STORY_ID", as: "storyChaptersList" });

StoryAccess.belongsTo(Story, { foreignKey: "STORY_ID", as: "accessStoryRef" });
Story.hasMany(StoryAccess, { foreignKey: "STORY_ID", as: "storyAccessList" });

StoryAccess.belongsTo(AppUser, { foreignKey: "USER_ID", as: "accessReaderUser" });
AppUser.hasMany(StoryAccess, { foreignKey: "USER_ID", as: "appUserStoryAccesses" });

StoryAccess.belongsTo(Admin, { foreignKey: "GRANTED_BY", as: "accessGrantedByAdmin" });
Admin.hasMany(StoryAccess, { foreignKey: "GRANTED_BY", as: "adminGrantedStories" });

/* =====================
   SYSTEM EVENTS
===================== */
SystemEvent.belongsTo(Admin, { foreignKey: "ADMIN_ID", as: "eventAdminRef" });
Admin.hasMany(SystemEvent, { foreignKey: "ADMIN_ID", as: "adminSystemEvents" });

SystemEvent.belongsTo(AppUser, { foreignKey: "USER_ID", as: "eventUserRef" });
AppUser.hasMany(SystemEvent, { foreignKey: "USER_ID", as: "appUserSystemEvents" });

/* =====================
   USER GAME
===================== */
UserGame.belongsTo(AppUser, { foreignKey: "USER_ID", as: "userGameAppUserRef" });
AppUser.hasMany(UserGame, { foreignKey: "USER_ID", as: "appUserGamesList" });

UserGame.belongsTo(Game, { foreignKey: "GAME_ID", as: "userGameGameRef" });
Game.hasMany(UserGame, { foreignKey: "GAME_ID", as: "gameUserGamesList" });

/* =====================
   PLAN / USER (1:N)
===================== */
// Un plan puede tener muchos usuarios
Plan.hasMany(AppUser, { foreignKey: "planId", as: "planUsers" });
AppUser.belongsTo(Plan, { foreignKey: "planId", as: "userPlan" });

/* =====================
   EXPORTS
===================== */
export {
  Person,
  AppUser,
  Admin,
  UserPending,
  BankCard,
  BankEntity,
  Game,
  GameWord,
  MathOption,
  MathOperation,
  GameMatch,
  DailyGameReward,
  Streak,
  Leaderboard,
  Payment,
  PaymentTrace,
  Notification,
  Story,
  Chapter,
  StoryAccess,
  SystemEvent,
  UserGame,
  Plan
};
