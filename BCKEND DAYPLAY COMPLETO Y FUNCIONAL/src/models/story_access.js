import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Story from "./story.js";
import AppUser from "./app_user.js";
import Admin from "./admin.js";

const StoryAccess = sequelize.define("StoryAccess", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  storyId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "STORY_ID"
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "USER_ID"
  },
  grantedBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "GRANTED_BY"
  },
  accessGranted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "ACCESS_GRANTED"
  },
  grantDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "GRANT_DATE"
  },
  revokeDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "REVOKE_DATE"
  },
  notes: {
    type: DataTypes.STRING(255),
    field: "NOTES"
  }
}, {
  tableName: "STORY_ACCESS",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["USER_ID", "STORY_ID"]
    }
  ]
});

// Relaciones
StoryAccess.belongsTo(Story, { foreignKey: "STORY_ID", as: "story" });
Story.hasMany(StoryAccess, { foreignKey: "STORY_ID", as: "accesses" });

StoryAccess.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(StoryAccess, { foreignKey: "USER_ID", as: "storyAccesses" });

StoryAccess.belongsTo(Admin, { foreignKey: "GRANTED_BY", as: "grantedByAdmin" });
Admin.hasMany(StoryAccess, { foreignKey: "GRANTED_BY", as: "grantedStories" });

export default StoryAccess;
