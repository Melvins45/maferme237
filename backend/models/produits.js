'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produits extends Model {
    static associate(models) {
      this.belongsTo(models.Fournisseurs, { foreignKey: 'idFournisseur' });
      // In models/fournisseurs.js consider: this.hasMany(models.Produits, { foreignKey: 'idFournisseur' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Produits, { foreignKey: 'idGestionnaire' });
      this.belongsTo(models.CategorieProduits, { foreignKey: 'idCategorieProduit', as: 'categorie' });
      this.belongsToMany(models.Etapeproductions, { through: models.Etapeproduits, foreignKey: 'idProduit', otherKey: 'idEtapeProduction' });
      this.hasMany(models.Plannificationetapeproductions, { foreignKey: 'idProduit' });
      // In models/plannificationetapeproductions.js consider: this.belongsTo(models.Produits, { foreignKey: 'idProduit' });
      this.hasMany(models.ProduitImages, { foreignKey: 'idProduit', as: 'images' });
    }
  }
  Produits.init({
    idProduit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomProduit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descriptionProduit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    prixClientProduit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    prixEntrepriseProduit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    prixFournisseurProduit: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    stockProduit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stockFournisseurProduit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantiteMinProduitEntreprise: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantiteMinProduitClient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    statutVerificationProduit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    statutProductionProduit: {
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
    idFournisseur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idGestionnaire: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCategorieProduit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Produits',
    tableName: 'produits',
    timestamps: true
  });
  return Produits;
};
