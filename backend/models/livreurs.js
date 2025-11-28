'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Livreurs extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idLivreur' });
      // In models/personnes.js consider: this.hasMany(models.Livreurs, { foreignKey: 'idLivreur' });
    }
  }
  Livreurs.init({
    idLivreur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    modelName: 'Livreurs',
    tableName: 'livreurs',
    timestamps: true
  });
  return Livreurs;
};
