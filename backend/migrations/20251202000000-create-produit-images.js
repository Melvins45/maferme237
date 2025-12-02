// migrations/[timestamp]-create-produit-images.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produitImages', {
      idProduitImage: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      idProduit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'produits',
          key: 'idProduit'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cheminImage: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Chemin ou URL de l\'image'
      },
      blobImage: {
        type: Sequelize.BLOB('long'),
        allowNull: true,
        comment: 'Image stockée en blob'
      },
      texteAltImage: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Texte alternatif pour l\'image'
      },
      estImagePrincipale: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Marque l\'image principale du produit'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('produitImages');
  }
};
