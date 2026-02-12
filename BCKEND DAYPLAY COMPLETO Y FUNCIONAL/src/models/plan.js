// models/plan.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Plan = sequelize.define("Plan", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  planType: {
    type: DataTypes.ENUM("BASIC", "PREMIUM"),
    allowNull: false
  }
}, {
  tableName: "PLAN",
  timestamps: false
});

export default Plan;
