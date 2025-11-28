'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('souhaitproduits', {
      idSouhaitProduit: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      objetSouhaitProduit: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      descriptionSouhaitProduit: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dateSouhaitProduit: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idClient: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      idEntreprise: {
        type: Sequelize.INTEGER(11),
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
    await queryInterface.dropTable('souhaitproduits');
  }
};
