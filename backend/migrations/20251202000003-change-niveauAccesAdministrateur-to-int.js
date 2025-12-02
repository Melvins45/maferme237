'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('administrateurs', 'niveauAccesAdministrateur', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('administrateurs', 'niveauAccesAdministrateur', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  }
};
