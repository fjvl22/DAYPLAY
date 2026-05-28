module.exports = (sequelize, DataTypes) => {
    const MathOption = sequelize.define('MathOption', {
      id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true, field: 'ID' },
      optionValue: { type: DataTypes.STRING(5), allowNull: false, unique: true, field: 'OPTION_VALUE' },
      operationId: { type: DataTypes.INTEGER.UNSIGNED, field: 'OPERATION_ID' }
    }, {
      tableName: 'MATH_OPTION',
      timestamps: false
    });

    MathOption.associate = (models) => {
      MathOption.belongsTo(models.MathOperation, { foreignKey: 'operationId' });
    };
  
    return MathOption;
  };