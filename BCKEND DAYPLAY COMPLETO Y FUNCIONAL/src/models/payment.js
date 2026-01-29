import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import AppUser from "./app_user.js";

const Payment = sequelize.define("Payment", {
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
  amount: {
    type: DataTypes.DECIMAL(8,2),
    allowNull: false,
    field: "AMOUNT"
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: "DATE"
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "PAYMENT_METHOD"
  },
  transactionId: {
    type: DataTypes.STRING(100),
    field: "TRANSACTION_ID"
  }
}, {
  tableName: "PAYMENT",
  timestamps: false
});

// Relaciones
Payment.belongsTo(AppUser, { foreignKey: "USER_ID", as: "user" });
AppUser.hasMany(Payment, { foreignKey: "USER_ID", as: "payments" });

export default Payment;
