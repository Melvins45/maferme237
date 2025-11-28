"use strict";
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Etapeproduits extends Model {
    static associate(models) {
      this.belongsTo(models.Etapeproductions, { foreignKey: 'idEtapeProduction' });
      // In models/etapeproductions.js consider: this.hasMany(models.Etapeproduits, { foreignKey: 'idEtapeProduction' });
      this.belongsTo(models.Produits, { foreignKey: 'idProduit' });
      // In models/produits.js consider: this.hasMany(models.Etapeproduits, { foreignKey: 'idProduit' });
    }
  }
  Etapeproduits.init({
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idEtapeProduction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    idProduit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Etapeproduits',
    tableName: 'etapeproduits',
    timestamps: true
  });
  return Etapeproduits;
};
