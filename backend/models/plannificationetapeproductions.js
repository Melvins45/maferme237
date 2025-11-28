"use strict";
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plannificationetapeproductions extends Model {
    static associate(models) {
      this.belongsTo(models.Etapeproductions, { foreignKey: 'idEtapeProduction' });
      // In models/etapeproductions.js consider: this.hasMany(models.Plannificationetapeproductions, { foreignKey: 'idEtapeProduction' });

      this.belongsTo(models.Fournisseurs, { foreignKey: 'idFournisseur' });
      // In models/fournisseurs.js consider: this.hasMany(models.Plannificationetapeproductions, { foreignKey: 'idFournisseur' });

      this.belongsTo(models.Producteurs, { foreignKey: 'idProducteur' });
      // In models/producteurs.js consider: this.hasMany(models.Plannificationetapeproductions, { foreignKey: 'idProducteur' });

      this.belongsTo(models.Produits, { foreignKey: 'idProduit' });
      // In models/produits.js consider: this.hasMany(models.Plannificationetapeproductions, { foreignKey: 'idProduit' });
    }
  }
  Plannificationetapeproductions.init({
    idPlannificationEtapeProduction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descriptionPlannificationEtapeProduction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    statutPlannificationEtapeProduction: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dateDebutPlannificationEtapeProduction: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateFinPlannificationEtapeProduction: {
      type: DataTypes.DATE,
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
    idEtapeProduction: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProduit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idFournisseur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProducteur: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Plannificationetapeproductions',
    tableName: 'plannificationetapeproductions',
    timestamps: true
  });
  return Plannificationetapeproductions;
};
