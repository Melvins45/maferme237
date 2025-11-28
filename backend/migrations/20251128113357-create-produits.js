'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produits', {
      idProduit: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nomProduit: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      descriptionProduit: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      prixClientProduit: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      prixEntrepriseProduit: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      prixFournisseurProduit: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      stockProduit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      stockFournisseurProduit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      quantiteMinProduitEntreprise: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      quantiteMinProduitClient: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      photosProduit: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      statutVerificationProduit: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      idFournisseur: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      idGestionnaire: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produits');
  }
};
