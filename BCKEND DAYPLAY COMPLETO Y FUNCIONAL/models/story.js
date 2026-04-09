// models/story.js
module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define('Story', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING(100), allowNull: false },
      monthYear: { type: DataTypes.CHAR(7), allowNull: false, unique: true },
      description: DataTypes.TEXT,
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'STORY',
      timestamps: false
    });

    Story.associate = (models) => {
      Story.hasMany(models.Chapter, { foreignKey: 'STORY_ID' });
      Story.hasMany(models.StoryAccess, { foreignKey: 'STORY_ID' });
    };
  
    return Story;
  };
  