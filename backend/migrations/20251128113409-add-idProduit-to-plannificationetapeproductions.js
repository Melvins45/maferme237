'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('plannificationetapeproductions', 'idProduit', {
      type: Sequelize.INTEGER(11),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('plannificationetapeproductions', 'idProduit');
  }
};
