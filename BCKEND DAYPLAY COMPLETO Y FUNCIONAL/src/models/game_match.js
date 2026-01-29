import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Game from "./game.js";

const GameMatch = sequelize.define("GameMatch", {
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
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  extraData: {
    type: DataTypes.JSON,
    field: "EXTRA_DATA"
  }
}, {
  tableName: "GAME_MATCH",
  timestamps: false
});

// Relaciones
GameMatch.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(GameMatch, { foreignKey: "USER_ID", as: "matches" });

GameMatch.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(GameMatch, { foreignKey: "GAME_ID", as: "matches" });

export default GameMatch;
