// models/storyAccess.js
module.exports = (sequelize, DataTypes) => {
    const StoryAccess = sequelize.define('StoryAccess', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      storyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      grantedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      accessGranted: { type: DataTypes.BOOLEAN, defaultValue: true },
      grantDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      revokeDate: DataTypes.DATE,
      notes: DataTypes.STRING(255)
    }, {
      tableName: 'STORY_ACCESS',
      timestamps: false,
      indexes: [{ unique: true, fields: ['userId','storyId'] }]
    });

    StoryAccess.associate = (models) => {
      StoryAccess.belongsTo(models.Story, { foreignKey: 'STORY_ID' });
      StoryAccess.belongsTo(models.AppUser, { foreignKey: 'USER_ID' });
      StoryAccess.belongsTo(models.Admin, { foreignKey: 'GRANTED_BY' });
    };
  
    return StoryAccess;
  };
  