// models/index.js
console.log("=== MODELS LOADED ===")
import Person from "./person.js";
import AppUser from "./app_user.js";
import Admin from "./admin.js";
import UserPending from "./user_pending.js";
import BankEntity from "./bank_entity.js";
import BankCard from "./bank_card.js";
import Game from "./game.js";
import GameWord from "./game_wword.js";
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

/* =====================
   PERSON / USER / ADMIN
===================== */
Person.hasOne(AppUser, { foreignKey: "PERSON_ID", as: "appUserProfile" });
AppUser.belongsTo(Person, { foreignKey: "PERSON_ID", as: "personDetails" });

Person.hasOne(Admin, { foreignKey: "PERSON_ID", as: "adminProfile" });
Admin.belongsTo(Person, { foreignKey: "PERSON_ID", as: "personDetailsAdmin" });

UserPending.belongsTo(AppUser, { foreignKey: "PERSON_ID", as: "userPendingRef" });
AppUser.hasOne(UserPending, { foreignKey: "PERSON_ID", as: "pendingRequestRef" });

/* =====================
   BANK ENTITY / BANK CARD
===================== */
BankCard.belongsTo(BankEntity, { foreignKey: "BANK_ENTITY_ID", as: "bankEntity" });
BankEntity.hasMany(BankCard, { foreignKey: "BANK_ENTITY_ID", as: "entityCards" });

BankCard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "cardOwner" });
AppUser.hasMany(BankCard, { foreignKey: "USER_ID", as: "userCards" });

/* =====================
   GAMES
===================== */
GameWord.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRef" });
Game.hasMany(GameWord, { foreignKey: "GAME_ID", as: "gameWords" });

MathOperation.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRefOp" });
Game.hasMany(MathOperation, { foreignKey: "GAME_ID", as: "mathOperations" });

MathOption.belongsTo(MathOperation, { foreignKey: "OPERATION_ID", as: "mathOperationRef" });
MathOperation.hasMany(MathOption, { foreignKey: "OPERATION_ID", as: "mathOptions" });

GameMatch.belongsTo(AppUser, { foreignKey: "USER_ID", as: "player" });
AppUser.hasMany(GameMatch, { foreignKey: "USER_ID", as: "matches" });

GameMatch.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRefMatch" });
Game.hasMany(GameMatch, { foreignKey: "GAME_ID", as: "gameMatches" });

DailyGameReward.belongsTo(AppUser, { foreignKey: "USER_ID", as: "rewardUser" });
AppUser.hasMany(DailyGameReward, { foreignKey: "USER_ID", as: "dailyRewards" });

Streak.belongsTo(AppUser, { foreignKey: "USER_ID", as: "streakUser" });
AppUser.hasMany(Streak, { foreignKey: "USER_ID", as: "streaks" });

Streak.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRefStreak" });
Game.hasMany(Streak, { foreignKey: "GAME_ID", as: "streaksGame" });

Leaderboard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "leaderboardUser" });
AppUser.hasMany(Leaderboard, { foreignKey: "USER_ID", as: "leaderboards" });

Leaderboard.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRefLeaderboard" });
Game.hasMany(Leaderboard, { foreignKey: "GAME_ID", as: "leaderboardsGame" });

/* =====================
   PAYMENTS
===================== */
Payment.belongsTo(AppUser, { foreignKey: "USER_ID", as: "payerUser" });
AppUser.hasMany(Payment, { foreignKey: "USER_ID", as: "payments" });

PaymentTrace.belongsTo(Payment, { foreignKey: "PAYMENT_ID", as: "paymentRef" });
Payment.hasMany(PaymentTrace, { foreignKey: "PAYMENT_ID", as: "traces" });

PaymentTrace.belongsTo(Admin, { foreignKey: "UPDATED_BY", as: "updatedByAdmin" });
Admin.hasMany(PaymentTrace, { foreignKey: "UPDATED_BY", as: "paymentTraces" });

/* =====================
   NOTIFICATIONS
===================== */
Notification.belongsTo(AppUser, { foreignKey: "USER_ID", as: "targetUser" });
AppUser.hasMany(Notification, { foreignKey: "USER_ID", as: "notifications" });

Notification.belongsTo(Admin, { foreignKey: "CREATED_BY", as: "creatorAdmin" });
Admin.hasMany(Notification, { foreignKey: "CREATED_BY", as: "createdNotifications" });

/* =====================
   STORIES / CHAPTERS / STORY_ACCESS
===================== */
Chapter.belongsTo(Story, { foreignKey: "STORY_ID", as: "storyRef" });
Story.hasMany(Chapter, { foreignKey: "STORY_ID", as: "chapters" });

StoryAccess.belongsTo(Story, { foreignKey: "STORY_ID", as: "storyRefAccess" });
Story.hasMany(StoryAccess, { foreignKey: "STORY_ID", as: "storyAccesses" });

StoryAccess.belongsTo(AppUser, { foreignKey: "USER_ID", as: "readerUser" });
AppUser.hasMany(StoryAccess, { foreignKey: "USER_ID", as: "userStoryAccesses" });

StoryAccess.belongsTo(Admin, { foreignKey: "GRANTED_BY", as: "grantedByAdmin" });
Admin.hasMany(StoryAccess, { foreignKey: "GRANTED_BY", as: "grantedStories" });

/* =====================
   SYSTEM EVENTS
===================== */
SystemEvent.belongsTo(Admin, { foreignKey: "ADMIN_ID", as: "adminRef" });
Admin.hasMany(SystemEvent, { foreignKey: "ADMIN_ID", as: "systemEventsAdmin" });

SystemEvent.belongsTo(AppUser, { foreignKey: "USER_ID", as: "eventUser" });
AppUser.hasMany(SystemEvent, { foreignKey: "USER_ID", as: "systemEventsUser" });

/* =====================
   USER GAME
===================== */
UserGame.belongsTo(AppUser, { foreignKey: "USER_ID", as: "gameUser" });
AppUser.hasMany(UserGame, { foreignKey: "USER_ID", as: "userGames" });

UserGame.belongsTo(Game, { foreignKey: "GAME_ID", as: "gameRefUserGame" });
Game.hasMany(UserGame, { foreignKey: "GAME_ID", as: "userGamesGame" });

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
  UserGame
};
