'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('plannificationetapeproductions', {
      fields: ['idProduit'],
      type: 'foreign key',
      name: 'fk_plannificationetapeproductions_idProduit',
      references: {
        table: 'produits',
        field: 'idProduit'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('plannificationetapeproductions', 'fk_plannificationetapeproductions_idProduit');
  }
};
