// models/notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      type: { type: DataTypes.STRING(50), allowNull: false },
      title: DataTypes.STRING(100),
      message: { type: DataTypes.TEXT, allowNull: false },
      sentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      createdBy: DataTypes.INTEGER.UNSIGNED
    }, {
      tableName: 'NOTIFICATION',
      timestamps: false
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.AppUser, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Notification.belongsTo(models.Admin, { foreignKey: 'createdBy' });
    };
  
    return Notification;
  };
  