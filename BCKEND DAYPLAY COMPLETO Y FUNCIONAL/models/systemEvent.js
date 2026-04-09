// models/systemEvent.js
module.exports = (sequelize, DataTypes) => {
    const SystemEvent = sequelize.define('SystemEvent', {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      adminId: DataTypes.INTEGER.UNSIGNED,
      userId: DataTypes.INTEGER.UNSIGNED,
      eventType: { type: DataTypes.STRING(100), allowNull: false },
      description: DataTypes.TEXT,
      category: { type: DataTypes.ENUM('ADMIN','USER','SYSTEM'), allowNull: false },
      eventDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      ipAddress: DataTypes.STRING(45)
    }, {
      tableName: 'SYSTEM_EVENT',
      timestamps: false
    });

    SystemEvent.associate = (models) => {
      SystemEvent.belongsTo(models.Admin, { foreignKey: 'ADMIN_ID' });
      SystemEvent.belongsTo(models.AppUser, { foreignKey: 'USER_ID' });
    };
  
    return SystemEvent;
  };
  