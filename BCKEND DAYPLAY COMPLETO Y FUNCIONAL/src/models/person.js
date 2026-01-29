import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Person = sequelize.define("Person", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: "PASSWORD_HASH"
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  registrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "REGISTRATION_DATE"
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  personType: {
    type: DataTypes.ENUM("USER", "ADMIN"),
    allowNull: false,
    field: "PERSON_TYPE"
  }
}, {
  tableName: "PERSON",
  timestamps: false
});

export default Person;
