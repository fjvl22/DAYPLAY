// models/mathOption.js
module.exports = (sequelize, DataTypes) => {
    const MathOption = sequelize.define('MathOption', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
      optionValue: { type: DataTypes.STRING(5), allowNull: false, unique: true },
      operationId: { type: DataTypes.INTEGER.UNSIGNED }
    }, {
      tableName: 'MATH_OPTION',
      timestamps: false
    });

    MathOption.associate = (models) => {
      MathOption.belongsTo(models.MathOperation, { foreignKey: 'OPERATION_ID' });
    };
  
    return MathOption;
  };
  