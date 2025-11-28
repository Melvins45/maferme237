'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etapeproductions', {
      idEtapeProduction: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titreEtapeProduction: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      descriptionEtapeProduction: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dateEtapeProduction: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      idFournisseur: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      idProducteur: {
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
    await queryInterface.dropTable('etapeproductions');
  }
};
