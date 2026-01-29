import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Game from "./game.js";

const Leaderboard = sequelize.define("Leaderboard", {
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
  totalPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "TOTAL_POINTS"
  },
  lastUpdate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "LAST_UPDATE"
  }
}, {
  tableName: "LEADERBOARD",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["USER_ID", "GAME_ID"]
    }
  ]
});

// Relaciones
Leaderboard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(Leaderboard, { foreignKey: "USER_ID", as: "leaderboards" });

Leaderboard.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(Leaderboard, { foreignKey: "GAME_ID", as: "leaderboards" });

export default Leaderboard;
