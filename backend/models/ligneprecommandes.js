'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ligneprecommandes extends Model {
    static associate(models) {
      this.belongsTo(models.Precommandes, { foreignKey: 'idPrecommande' });
      // In models/precommandes.js consider: this.hasMany(models.Ligneprecommandes, { foreignKey: 'idPrecommande' });
      this.belongsTo(models.Produits, { foreignKey: 'idProduit' });
      // In models/produits.js consider: this.hasMany(models.Ligneprecommandes, { foreignKey: 'idProduit' });
    }
  }
  Ligneprecommandes.init({
    quantite: {
      type: DataTypes.INTEGER,
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
    idPrecommande: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idProduit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Ligneprecommandes',
    tableName: 'ligneprecommandes',
    timestamps: true
  });
  return Ligneprecommandes;
};
