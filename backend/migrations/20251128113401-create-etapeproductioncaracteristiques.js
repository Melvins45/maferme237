'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etapeproductioncaracteristiques', {
      valeurCaracteristique: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      idEtapeProduction: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
      },
      idCaracteristique: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
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
    await queryInterface.dropTable('etapeproductioncaracteristiques');
  }
};
