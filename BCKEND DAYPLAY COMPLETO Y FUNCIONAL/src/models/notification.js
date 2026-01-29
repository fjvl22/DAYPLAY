import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Admin from "./admin.js";

const Notification = sequelize.define("Notification", {
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
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "TYPE"
  },
  title: {
    type: DataTypes.STRING(100),
    field: "TITLE"
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: "MESSAGE"
  },
  sentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "SENT_DATE"
  },
  createdBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "CREATED_BY"
  }
}, {
  tableName: "NOTIFICATION",
  timestamps: false
});

// Relaciones
Notification.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(Notification, { foreignKey: "USER_ID", as: "notifications" });

Notification.belongsTo(Admin, { foreignKey: "CREATED_BY", as: "creator" });
Admin.hasMany(Notification, { foreignKey: "CREATED_BY", as: "createdNotifications" });

export default Notification;
