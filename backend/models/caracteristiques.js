'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caracteristiques extends Model {
    static associate(models) {
      this.belongsTo(models.Fournisseurs, { foreignKey: 'idFournisseur' });
      this.belongsTo(models.Producteurs, { foreignKey: 'idProducteur' });
      this.belongsTo(models.Gestionnaires, { foreignKey: 'idGestionnaire' });
      this.belongsToMany(models.Produits, { 
        through: models.ProduitCaracteristiques, 
        foreignKey: 'idCaracteristique', 
        otherKey: 'idProduit',
        as: 'produits'
      });
    }
  }
  Caracteristiques.init({
    idCaracteristique: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nomCaracteristique: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    typeValeurCaracteristique: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    uniteValeurCaracteristique: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    idFournisseur: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProducteur: {
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
  }, {
    sequelize,
    modelName: 'Caracteristiques',
    tableName: 'caracteristiques',
    timestamps: true
  });
  return Caracteristiques;
};
