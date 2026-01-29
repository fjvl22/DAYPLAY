import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";

const DailyGameReward = sequelize.define("DailyGameReward", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "USER_ID"
  },
  rewardDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "REWARD_DATE"
  },
  totalScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "TOTAL_SCORE"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CREATED_AT"
  }
}, {
  tableName: "DAILY_GAME_REWARD",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["USER_ID", "REWARD_DATE"]
    }
  ]
});

// Relaciones
DailyGameReward.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(DailyGameReward, { foreignKey: "USER_ID", as: "dailyRewards" });

export default DailyGameReward;
