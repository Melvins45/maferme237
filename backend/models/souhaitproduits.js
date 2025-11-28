'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Souhaitproduits extends Model {
    static associate(models) {
      this.belongsTo(models.Clients, { foreignKey: 'idClient' });
      // In models/clients.js consider: this.hasMany(models.Souhaitproduits, { foreignKey: 'idClient' });
      this.belongsTo(models.Entreprises, { foreignKey: 'idEntreprise' });
      // In models/entreprises.js consider: this.hasMany(models.Souhaitproduits, { foreignKey: 'idEntreprise' });
      this.belongsTo(models.Fournisseurs, { foreignKey: 'idFournisseur' });
      // In models/fournisseurs.js consider: this.hasMany(models.Souhaitproduits, { foreignKey: 'idFournisseur' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Souhaitproduits, { foreignKey: 'idGestionnaire' });
    }
  }
  Souhaitproduits.init({
    idSouhaitProduit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descriptionSouhaitProduit: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dateSouhaitProduit: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idClient: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idEntreprise: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idFournisseur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idGestionnaire: {
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
    objetSouhaitProduit: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Souhaitproduits',
    tableName: 'souhaitproduits',
    timestamps: true
  });
  return Souhaitproduits;
};
