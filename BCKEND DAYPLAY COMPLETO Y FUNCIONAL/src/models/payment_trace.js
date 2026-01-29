import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Payment from "./payment.js";
import Admin from "./admin.js";

const PaymentTrace = sequelize.define("PaymentTrace", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  paymentId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "PAYMENT_ID"
  },
  traceDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "TRACE_DATE"
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "ACTION"
  },
  notes: {
    type: DataTypes.TEXT,
    field: "NOTES"
  },
  updatedBy: {
    type: DataTypes.INTEGER.UNSIGNED,
    field: "UPDATED_BY"
  }
}, {
  tableName: "PAYMENT_TRACE",
  timestamps: false
});

// Relaciones
PaymentTrace.belongsTo(Payment, { foreignKey: "PAYMENT_ID", as: "payment" });
Payment.hasMany(PaymentTrace, { foreignKey: "PAYMENT_ID", as: "traces" });

PaymentTrace.belongsTo(Admin, { foreignKey: "UPDATED_BY", as: "updatedByAdmin" });
Admin.hasMany(PaymentTrace, { foreignKey: "UPDATED_BY", as: "paymentTraces" });

export default PaymentTrace;
