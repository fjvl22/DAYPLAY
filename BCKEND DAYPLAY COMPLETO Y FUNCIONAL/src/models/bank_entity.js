import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const BankEntity = sequelize.define("BankEntity", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  entityCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    field: "ENTITY_CODE"
  },
  address: {
    type: DataTypes.STRING(255)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CREATION_DATE"
  }
}, {
  tableName: "BANK_ENTITY",
  timestamps: false
});

export default BankEntity;
