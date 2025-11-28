'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Paiements extends Model {
    static associate(models) {
      this.belongsTo(models.Precommandes, { foreignKey: 'idPrecommande' });
      // In models/precommandes.js consider: this.hasMany(models.Paiements, { foreignKey: 'idPrecommande' });
      this.belongsTo(models.Livraisons, { foreignKey: 'idLivraison' });
      // In models/livraisons.js consider: this.hasMany(models.Paiements, { foreignKey: 'idLivraison' });
      this.belongsTo(models.Livreurs, { foreignKey: 'idLivreur' });
      // In models/livreurs.js consider: this.hasMany(models.Paiements, { foreignKey: 'idLivreur' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      // In models/gestionnaires.js consider: this.hasMany(models.Paiements, { foreignKey: 'idGestionnaire' });
    }
  }
  Paiements.init({
    idPaiement: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idTransaction: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    modePaiement: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    datePaiement: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idPrecommande: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idLivraison: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idLivreur: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    idGestionnaire: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Paiements',
    tableName: 'paiements',
    timestamps: true
  });
  return Paiements;
};
