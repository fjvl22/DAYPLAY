module.exports = (sequelize, DataTypes) => {
    const StoryAccess = sequelize.define('StoryAccess', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      storyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'STORY_ID' },
      userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'USER_ID' },
      grantedBy: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'GRANTED_BY' },
      accessGranted: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'ACCESS_GRANTED' },
      grantDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'GRANT_DATE' },
      revokeDate: { type: DataTypes.DATE, field: 'REVOKE_DATE' },
      notes: { type: DataTypes.STRING(255), field: 'NOTES' }
    }, {
      tableName: 'STORY_ACCESS',
      timestamps: false,
      indexes: [{ unique: true, fields: ['USER_ID','STORY_ID'] }]
    });

    StoryAccess.associate = (models) => {
      StoryAccess.belongsTo(models.Story, { foreignKey: 'storyId' });
      StoryAccess.belongsTo(models.AppUser, { foreignKey: 'userId' });
      StoryAccess.belongsTo(models.Admin, { foreignKey: 'grantedBy' });
    };
  
    return StoryAccess;
  };