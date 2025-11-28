'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('administrateurs', {
      idAdministrateur: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        allowNull: false,
      },
      niveauAccesAdministrateur: {
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
    await queryInterface.dropTable('administrateurs');
  }
};
