'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produitcaracteristiques extends Model {
    static associate(models) {
      this.belongsTo(models.Produits, { foreignKey: 'ProduitIdProduit' });
      // In models/produits.js consider: this.hasMany(models.Produitcaracteristiques, { foreignKey: 'ProduitIdProduit' });
      this.belongsTo(models.Caracteristiques, { foreignKey: 'idCaracteristique' });
      // In models/caracteristiques.js consider: this.hasMany(models.Produitcaracteristiques, { foreignKey: 'idCaracteristique' });
    }
  }
  Produitcaracteristiques.init({
    valeurCaracteristique: {
      type: DataTypes.STRING(255),
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
    ProduitIdProduit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCaracteristique: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Produitcaracteristiques',
    tableName: 'produitcaracteristiques',
    timestamps: true
  });
  return Produitcaracteristiques;
};
