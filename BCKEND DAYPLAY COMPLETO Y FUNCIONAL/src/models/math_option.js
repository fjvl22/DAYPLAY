import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import MathOperation from "./math_operation.js";

const MathOption = sequelize.define("MathOption", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  optionValue: {
    type: DataTypes.STRING(5),
    allowNull: false,
    unique: true,
    field: "OPTION_VALUE"
  },
  operationId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "OPERATION_ID"
  }
}, {
  tableName: "MATH_OPTION",
  timestamps: false
});

// Relaciones
MathOption.belongsTo(MathOperation, { foreignKey: "OPERATION_ID", as: "operation" });
MathOperation.hasMany(MathOption, { foreignKey: "OPERATION_ID", as: "options" });

export default MathOption;
