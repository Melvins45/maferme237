'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paiements', {
      idPaiement: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idTransaction: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      modePaiement: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      datePaiement: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idPrecommande: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      idLivraison: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      idLivreur: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
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
    await queryInterface.dropTable('paiements');
  }
};
