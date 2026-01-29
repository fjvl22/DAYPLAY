import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";
import Admin from "./admin.js";

const SystemEvent = sequelize.define("SystemEvent", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  adminId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "ADMIN_ID"
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: "USER_ID"
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "EVENT_TYPE"
  },
  description: {
    type: DataTypes.TEXT,
    field: "DESCRIPTION"
  },
  category: {
    type: DataTypes.ENUM("ADMIN", "USER", "SYSTEM"),
    allowNull: false,
    field: "CATEGORY"
  },
  eventDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "EVENT_DATE"
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: "IP_ADDRESS"
  }
}, {
  tableName: "SYSTEM_EVENT",
  timestamps: false
});

// Relaciones
SystemEvent.belongsTo(Admin, { foreignKey: "ADMIN_ID", as: "admin" });
Admin.hasMany(SystemEvent, { foreignKey: "ADMIN_ID", as: "systemEvents" });

SystemEvent.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(SystemEvent, { foreignKey: "USER_ID", as: "systemEvents" });

export default SystemEvent;
