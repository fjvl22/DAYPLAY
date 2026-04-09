// models/admin.js
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
      personId: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true },
      department: { type: DataTypes.ENUM('GAME','PAYMENT','EVENT','NOTIF'), allowNull: false },
      adminType: { type: DataTypes.ENUM('GAME_ADMIN','PAYMENT_ADMIN','EVENT_ADMIN','NOTIF_ADMIN'), allowNull: false },
      permissions: { type: DataTypes.JSON }
    }, {
      tableName: 'ADMIN',
      timestamps: false
    });

    Admin.associate = (models) => {
      Admin.belongsTo(models.Person, { foreignKey: 'PERSON_ID' });
  
      Admin.hasMany(models.PaymentTrace, { foreignKey: 'UPDATED_BY' });
      Admin.hasMany(models.Notification, { foreignKey: 'CREATED_BY' });
      Admin.hasMany(models.StoryAccess, { foreignKey: 'GRANTED_BY' });
      Admin.hasMany(models.SystemEvent, { foreignKey: 'ADMIN_ID' });
    };
  
    return Admin;
  };
  