'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('fournisseurs', 'verifiedBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'personnes',
        key: 'idPersonne'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('fournisseurs', 'verifiedBy');
  }
};
