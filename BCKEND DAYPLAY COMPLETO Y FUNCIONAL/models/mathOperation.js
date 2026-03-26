// models/mathOperation.js
module.exports = (sequelize, DataTypes) => {
    const MathOperation = sequelize.define('MathOperation', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      operation: { type: DataTypes.STRING(20), allowNull: false },
      result: { type: DataTypes.STRING(20), allowNull: false },
      gameId: { type: DataTypes.INTEGER.UNSIGNED }
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
  