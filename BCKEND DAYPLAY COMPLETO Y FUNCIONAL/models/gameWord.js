// models/gameWord.js
module.exports = (sequelize, DataTypes) => {
    const GameWord = sequelize.define('GameWord', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      word: { type: DataTypes.STRING(50), allowNull: false },
      language: { type: DataTypes.CHAR(2), defaultValue: 'ES' },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
      tableName: 'GAME_WORD',
      timestamps: false,
      indexes: [{ unique: true, fields: ['gameId', 'word'] }]
    });

    GameWord.associate = (models) => {
      GameWord.belongsTo(models.Game, { foreignKey: 'GAME_ID' });
    };
  
    return GameWord;
  };
  