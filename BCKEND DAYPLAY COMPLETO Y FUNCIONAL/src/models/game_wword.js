import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Game from "./game.js";

const GameWord = sequelize.define("GameWord", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  gameId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "GAME_ID"
  },
  word: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  language: {
    type: DataTypes.CHAR(2),
    defaultValue: "ES"
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CREATION_DATE"
  }
}, {
  tableName: "GAME_WORD",
  timestamps: false,
  indexes: [
    { unique: true, fields: ["GAME_ID", "word"] }
  ]
});

// Relación
GameWord.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(GameWord, { foreignKey: "GAME_ID", as: "words" });

export default GameWord;
