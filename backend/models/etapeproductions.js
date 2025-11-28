'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Etapeproductions extends Model {
    static associate(models) {
        this.belongsToMany(models.Produits, { through: models.Etapeproduits, foreignKey: 'idEtapeProduction', otherKey: 'idProduit' });
        // In models/produits.js we add: this.belongsToMany(models.Etapeproductions, { through: models.Etapeproduits, foreignKey: 'idProduit', otherKey: 'idEtapeProduction' });
      this.belongsTo(models.Fournisseurs, { foreignKey: 'idFournisseur' });
      // In models/fournisseurs.js consider: this.hasMany(models.Etapeproductions, { foreignKey: 'idFournisseur' });
      this.belongsTo(models.Producteurs, { foreignKey: 'idProducteur' });
      // In models/producteurs.js consider: this.hasMany(models.Etapeproductions, { foreignKey: 'idProducteur' });
    }
  }
  Etapeproductions.init({
    idEtapeProduction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titreEtapeProduction: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    descriptionEtapeProduction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dateEtapeProduction: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // `idProduit` removed in favor of a many-to-many through table `etapeproduits`
    idFournisseur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProducteur: {
      type: DataTypes.INTEGER,
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
    modelName: 'Etapeproductions',
    tableName: 'etapeproductions',
    timestamps: true
  });
  return Etapeproductions;
};
