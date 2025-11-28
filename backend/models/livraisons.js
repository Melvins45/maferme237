'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Livraisons extends Model {
    static associate(models) {
      this.belongsTo(models.Precommandes, { foreignKey: 'idPrecommande' });
      // In models/precommandes.js consider: this.hasMany(models.Livraisons, { foreignKey: 'idPrecommande' });
      this.belongsTo(models.Clients, { foreignKey: 'idClient' });
      // In models/clients.js consider: this.hasMany(models.Livraisons, { foreignKey: 'idClient' });
      this.belongsTo(models.Livreurs, { foreignKey: 'idLivreur' });
      // In models/livreurs.js consider: this.hasMany(models.Livraisons, { foreignKey: 'idLivreur' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Livraisons, { foreignKey: 'idGestionnaire' });
    }
  }
  Livraisons.init({
    idLivraison: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lieuLivraison: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dateDebutLivraison: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateFinLivraison: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idPrecommande: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idGestionnaire: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idLivreur: {
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
    modelName: 'Livraisons',
    tableName: 'livraisons',
    timestamps: true
  });
  return Livraisons;
};
