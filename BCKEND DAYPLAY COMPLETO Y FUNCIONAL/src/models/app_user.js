// models/app_user.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AppUser = sequelize.define("AppUser", {
  personId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: "PERSON_ID"
  },
  subscriptionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "SUBSCRIPTION_DATE"
  },
  planId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "PLAN_ID"
  }
}, {
  tableName: "APP_USER",
  timestamps: false
});

export default AppUser;
