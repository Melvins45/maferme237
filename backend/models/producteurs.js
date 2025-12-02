'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Producteurs extends Model {
    static associate(models) {
      this.belongsTo(models.Personnes, { foreignKey: 'idProducteur' });
      // In models/personnes.js consider: this.hasMany(models.Producteurs, { foreignKey: 'idProducteur' });
      this.belongsTo(models.CategorieProduits, { foreignKey: 'idCategorieProduit', as: 'categorie' });
    }
  }
  Producteurs.init({
    idProducteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    idCategorieProduit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CategorieProduits',
        key: 'idCategorieProduit'
      }
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
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
    modelName: 'Producteurs',
    tableName: 'producteurs',
    timestamps: true
  });
  return Producteurs;
};
