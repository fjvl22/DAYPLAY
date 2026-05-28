module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define('Chapter', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      storyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'STORY_ID' },
      dayNumber: { type: DataTypes.TINYINT, allowNull: false, field: 'DAY_NUMBER' },
      title: { type: DataTypes.STRING(100), allowNull: false, field: 'TITLE' },
      content: { type: DataTypes.TEXT, allowNull: false, field: 'CONTENT' },
      unlockCondition: { type: DataTypes.STRING(255), defaultValue: 'Win 4 games', field: 'UNLOCK_CONDITION' }
    }, {
      tableName: 'CHAPTER',
      timestamps: false,
      indexes: [{ unique: true, fields: ['STORY_ID','DAY_NUMBER'] }]
    });

    Chapter.associate = (models) => {
      Chapter.belongsTo(models.Story, { foreignKey: 'storyId' });
    };
  
    return Chapter;
  };