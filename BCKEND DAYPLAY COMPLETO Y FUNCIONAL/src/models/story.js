import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Story = sequelize.define("Story", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  monthYear: {
    type: DataTypes.CHAR(7),
    allowNull: false,
    unique: true,
    field: "MONTH_YEAR"
  },
  description: {
    type: DataTypes.TEXT
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CREATION_DATE"
  }
}, {
  tableName: "STORY",
  timestamps: false
});

export default Story;
