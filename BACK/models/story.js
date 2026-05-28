module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define('Story', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      title: { type: DataTypes.STRING(100), allowNull: false, field: 'TITLE' },
      monthYear: { type: DataTypes.CHAR(7), allowNull: false, unique: true, field: 'MONTH_YEAR' },
      description: { type: DataTypes.TEXT, field: 'DESCRIPTION' },
      active: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'ACTIVE' },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATION_DATE' }
    }, {
      tableName: 'STORY',
      timestamps: false
    });

    Story.associate = (models) => {
      Story.hasMany(models.Chapter, { foreignKey: 'storyId' });
      Story.hasMany(models.StoryAccess, { foreignKey: 'storyId' });
    };
  
    return Story;
  };