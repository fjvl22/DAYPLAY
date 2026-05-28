module.exports = (sequelize, DataTypes) => {
    const GameWord = sequelize.define('GameWord', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'GAME_ID' },
      word: { type: DataTypes.STRING(50), allowNull: false, field: 'WORD' },
      language: { type: DataTypes.CHAR(2), defaultValue: 'ES', field: 'LANGUAGE' },
      active: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'ACTIVE' },
      creationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'CREATION_DATE' }
    }, {
      tableName: 'GAME_WORD',
      timestamps: false,
      indexes: [{ unique: true, fields: ['GAME_ID', 'WORD'] }]
    });

    GameWord.associate = (models) => {
      GameWord.belongsTo(models.Game, { foreignKey: 'gameId' });
    };
  
    return GameWord;
  };