import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Game from "./game.js";

const Streak = sequelize.define("Streak", {
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
  gameId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "GAME_ID"
  },
  currentStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "CURRENT_STREAK"
  },
  lastDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: "LAST_DATE"
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "UPDATED_AT"
  }
}, {
  tableName: "STREAK",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["USER_ID", "GAME_ID"]
    }
  ]
});

// Relaciones
Streak.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(Streak, { foreignKey: "USER_ID", as: "streaks" });

Streak.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(Streak, { foreignKey: "GAME_ID", as: "streaks" });

export default Streak;
