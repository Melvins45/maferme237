'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pointlivraisons', {
      idPointLivraison: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      adressePointLivraison: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      idEntreprise: {
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
    await queryInterface.dropTable('pointlivraisons');
  }
};
