'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('producteurs', {
      idProducteur: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
      },
      specialiteProducteur: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable('producteurs');
  }
};
