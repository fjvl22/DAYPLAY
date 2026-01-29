import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Admin = sequelize.define("Admin", {
  personId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: "PERSON_ID"
  },
  department: {
    type: DataTypes.ENUM("GAME", "PAYMENT", "EVENT", "NOTIF"),
    allowNull: false,
    field: "DEPARTMENT"
  },
  adminType: {
    type: DataTypes.ENUM("GAME_ADMIN", "PAYMENT_ADMIN", "EVENT_ADMIN", "NOTIF_ADMIN"),
    allowNull: false,
    field: "ADMIN_TYPE"
  },
  permissions: {
    type: DataTypes.JSON,
    field: "PERMISSIONS"
  }
}, {
  tableName: "ADMIN",
  timestamps: false
});

export default Admin;
