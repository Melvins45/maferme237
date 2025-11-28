'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ligneprecommandes', {
      quantite: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      idPrecommande: {
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
    await queryInterface.dropTable('ligneprecommandes');
  }
};
