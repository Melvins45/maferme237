'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producteurs extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idProducteur' });
      // In models/personnes.js consider: this.hasMany(models.Producteurs, { foreignKey: 'idProducteur' });
    }
  }
  Producteurs.init({
    idProducteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    specialiteProducteur: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Producteurs',
    tableName: 'producteurs',
    timestamps: true
  });
  return Producteurs;
};
