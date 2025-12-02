// models/produitImages.js
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProduitImages = sequelize.define('ProduitImages', {
    idProduitImage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    idProduit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'produits',
        key: 'idProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    cheminImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Chemin ou URL de l\'image'
    },
    blobImage: {
      type: DataTypes.BLOB('long'),
      allowNull: true,
      comment: 'Image stockée en blob'
    },
    texteAltImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Texte alternatif pour l\'image'
    },
    estImagePrincipale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Marque l\'image principale du produit'
    }
  }, {
    tableName: 'produitImages',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  ProduitImages.associate = (models) => {
    ProduitImages.belongsTo(models.Produits, { foreignKey: 'idProduit', as: 'produit' });
  };

  return ProduitImages;
};
