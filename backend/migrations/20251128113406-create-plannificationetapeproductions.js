'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('plannificationetapeproductions', {
      idPlannificationEtapeProduction: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      descriptionPlannificationEtapeProduction: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      statutPlannificationEtapeProduction: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      dateDebutPlannificationEtapeProduction: {
        type: Sequelize.DATE,
        allowNull: true
      },
      dateFinPlannificationEtapeProduction: {
        type: Sequelize.DATE,
        allowNull: true
      },
      idEtapeProduction: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      idFournisseur: {
        type: Sequelize.INTEGER(11),
        allowNull: true
      },
      idProducteur: {
        type: Sequelize.INTEGER(11),
        allowNull: true
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
    await queryInterface.dropTable('plannificationetapeproductions');
  }
};
