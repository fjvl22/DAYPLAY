module.exports = (sequelize, DataTypes) => {
    const MathOperation = sequelize.define('MathOperation', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      operation: { type: DataTypes.STRING(20), allowNull: false, field: 'OPERATION' },
      result: { type: DataTypes.STRING(20), allowNull: false, field: 'RESULT' },
      gameId: { type: DataTypes.INTEGER.UNSIGNED, field: 'GAME_ID' }
    }, {
      tableName: 'MATH_OPERATION',
      timestamps: false
    });

    MathOperation.associate = (models) => {
      MathOperation.belongsTo(models.Game, { foreignKey: 'gameId' });
      MathOperation.hasMany(models.MathOption, { foreignKey: 'operationId' });
    };
  
    return MathOperation;
  };