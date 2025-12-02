'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fournisseurs extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idFournisseur' });
      // In models/personnes.js consider: this.hasMany(models.Fournisseurs, { foreignKey: 'idFournisseur' });
    }
  }
  Fournisseurs.init({
    idFournisseur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    noteClientFournisseur: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    noteEntrepriseFournisseur: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    verifieFournisseur: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    verifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    },
    historiqueProduits: {
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
    modelName: 'Fournisseurs',
    tableName: 'fournisseurs',
    timestamps: true
  });
  return Fournisseurs;
};
