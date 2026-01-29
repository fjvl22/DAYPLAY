import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Game from "./game.js";

const MathOperation = sequelize.define("MathOperation", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  operation: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  result: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  gameId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "GAME_ID"
  }
}, {
  tableName: "MATH_OPERATION",
  timestamps: false
});

// Relación
MathOperation.belongsTo(Game, { foreignKey: "GAME_ID", as: "game" });
Game.hasMany(MathOperation, { foreignKey: "GAME_ID", as: "operations" });

export default MathOperation;
