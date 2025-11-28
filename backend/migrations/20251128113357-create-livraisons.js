'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('livraisons', {
      idLivraison: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      lieuLivraison: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      dateDebutLivraison: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dateFinLivraison: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idPrecommande: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      idGestionnaire: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      idLivreur: {
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
    await queryInterface.dropTable('livraisons');
  }
};
