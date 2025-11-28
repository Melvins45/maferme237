'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fournisseurs', {
      idFournisseur: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
      },
      noteClientFournisseur: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      noteEntrepriseFournisseur: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      verifieFournisseur: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      historiqueProduits: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('fournisseurs');
  }
};
