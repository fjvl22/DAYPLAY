// models/chapter.js
module.exports = (sequelize, DataTypes) => {
    const Chapter = sequelize.define('Chapter', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      storyId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      dayNumber: { type: DataTypes.TINYINT, allowNull: false },
      title: { type: DataTypes.STRING(100), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      unlockCondition: { type: DataTypes.STRING(255), defaultValue: 'Win 4 games' }
    }, {
      tableName: 'CHAPTER',
      timestamps: false,
      indexes: [{ unique: true, fields: ['storyId','dayNumber'] }]
    });

    Chapter.associate = (models) => {
      Chapter.belongsTo(models.Story, { foreignKey: 'STORY_ID' });
    };
  
    return Chapter;
  };
  