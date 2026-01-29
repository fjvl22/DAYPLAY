import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";

const UserPending = sequelize.define("UserPending", {
  personId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: "PERSON_ID"
  }
}, {
  tableName: "USER_PENDING",
  timestamps: false
});

UserPending.belongsTo(AppUser, {
  foreignKey: "PERSON_ID",
  as: "user"
});

AppUser.hasOne(UserPending, {
  foreignKey: "PERSON_ID",
  as: "pending"
});

export default UserPending;
