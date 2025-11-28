'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etapeproduits', {
      idEtapeProduction: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
      },
      idProduit: {
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
    await queryInterface.dropTable('etapeproduits');
  }
};
