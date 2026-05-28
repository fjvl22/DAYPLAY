module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'USER_ID' },
      type: { type: DataTypes.STRING(50), allowNull: false, field: 'TYPE' },
      title: { type: DataTypes.STRING(100), field: 'TITLE' },
      message: { type: DataTypes.TEXT, allowNull: false, field: 'MESSAGE' },
      sentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'SENT_DATE' },
      createdBy: { type: DataTypes.INTEGER.UNSIGNED, field: 'CREATED_BY' }
    }, {
      tableName: 'NOTIFICATION',
      timestamps: false
    });

    Notification.associate = (models) => {
      Notification.belongsTo(models.AppUser, { foreignKey: 'userId' });
      Notification.belongsTo(models.Admin, { foreignKey: 'createdBy' });
    };
  
    return Notification;
  };