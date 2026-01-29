import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Game from "./game.js";

const UserGame = sequelize.define("UserGame", {
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: "USER_ID"
  },
  gameId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: "GAME_ID"
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "USER_GAME",
  timestamps: false
});

// Relaciones
UserGame.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(UserGame, { foreignKey: "USER_ID", as: "userGames" });

UserGame.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(UserGame, { foreignKey: "GAME_ID", as: "userGames" });

export default UserGame;
