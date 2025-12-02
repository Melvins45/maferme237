'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('produits', 'photosProduit');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('produits', 'photosProduit', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  }
};
