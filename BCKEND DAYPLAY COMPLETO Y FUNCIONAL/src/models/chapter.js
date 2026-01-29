import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Story from "./story.js";

const Chapter = sequelize.define("Chapter", {
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
  dayNumber: {
    type: DataTypes.TINYINT,
    allowNull: false,
    field: "DAY_NUMBER"
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  unlockCondition: {
    type: DataTypes.STRING(255),
    defaultValue: "Win 4 games",
    field: "UNLOCK_CONDITION"
  }
}, {
  tableName: "CHAPTER",
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ["STORY_ID", "DAY_NUMBER"]
    }
  ]
});

// Relaciones
Chapter.belongsTo(Story, { foreignKey: "STORY_ID", as: "story" });
Story.hasMany(Chapter, { foreignKey: "STORY_ID", as: "chapters" });

export default Chapter;
