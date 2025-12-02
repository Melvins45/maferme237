'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CategorieProduits extends Model {
    static associate(models) {
      // One-to-Many: CategorieProduits has many Produits
      CategorieProduits.hasMany(models.Produits, {
        foreignKey: 'idCategorieProduit',
        as: 'produits'
      });

      // Many-to-One: CategorieProduits belongs to Fournisseur (optional creator)
      CategorieProduits.belongsTo(models.Fournisseurs, {
        foreignKey: 'idFournisseur',
        as: 'fournisseurCreateur'
      });

      // Many-to-One: CategorieProduits belongs to Producteur (optional creator)
      CategorieProduits.belongsTo(models.Producteurs, {
        foreignKey: 'idProducteur',
        as: 'producteurCreateur'
      });

      // Many-to-One: CategorieProduits belongs to Gestionnaire (optional creator)
      CategorieProduits.belongsTo(models.Gestionnaires, {
        foreignKey: 'idGestionnaire',
        as: 'gestionnaireCreateur'
      });

      // Many-to-One: CategorieProduits belongs to Administrateur (optional creator)
      CategorieProduits.belongsTo(models.Administrateurs, {
        foreignKey: 'idAdministrateur',
        as: 'administrateurCreateur'
      });
    }
  }

  CategorieProduits.init(
    {
      idCategorieProduit: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nomCategorieProduit: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      descriptionCategorieProduit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      dateCreationCategorie: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
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
      idAdministrateur: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'CategorieProduits',
      tableName: 'CategorieProduits',
      timestamps: true
    }
  );

  return CategorieProduits;
};
