import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BankEntity from "./bank_entity.js";
import AppUser from "./app_user.js";

const BankCard = sequelize.define("BankCard", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  last4: {
    type: DataTypes.CHAR(4),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(30)
  },
  bin: {
    type: DataTypes.STRING(8)
  },
  expiryMonth: {
    type: DataTypes.TINYINT,
    field: "EXPIRY_MONTH"
  },
  expiryYear: {
    type: DataTypes.SMALLINT,
    field: "EXPIRY_YEAR"
  },
  approxBalance: {
    type: DataTypes.DECIMAL(10,2),
    field: "APPROX_BALANCE"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "IS_ACTIVE"
  },
  bankEntityId: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "BANK_ENTITY_ID"
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "USER_ID"
  },
  creationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CREATION_DATE"
  }
}, {
  tableName: "BANK_CARD",
  timestamps: false
});

BankCard.belongsTo(BankEntity, { foreignKey: "BANK_ENTITY_ID", as: "bank" });
BankEntity.hasMany(BankCard, { foreignKey: "BANK_ENTITY_ID", as: "cards" });

BankCard.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(BankCard, { foreignKey: "USER_ID", as: "cards" });

export default BankCard;
