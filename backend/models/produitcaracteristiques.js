'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProduitCaracteristiques extends Model {
    static associate(models) {
      this.belongsTo(models.Produits, { foreignKey: 'idProduit' });
      // In models/produits.js consider: this.hasMany(models.ProduitCaracteristiques, { foreignKey: 'idProduit' });
      this.belongsTo(models.Caracteristiques, { foreignKey: 'idCaracteristique' });
      // In models/caracteristiques.js consider: this.hasMany(models.ProduitCaracteristiques, { foreignKey: 'idCaracteristique' });
    }
  }
  ProduitCaracteristiques.init({
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
    idProduit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idCaracteristique: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ProduitCaracteristiques',
    tableName: 'produitcaracteristiques',
    timestamps: true
  });
  return ProduitCaracteristiques;
};
